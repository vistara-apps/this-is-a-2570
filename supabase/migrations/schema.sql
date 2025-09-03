-- Supabase Database Schema for PixelFlow AI

-- Enable RLS (Row Level Security)
alter database postgres set "app.settings.jwt_secret" to 'your-jwt-secret';

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'premium')),
  stripe_customer_id text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create images table
create table images (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  original_url text not null,
  edited_url text,
  name text,
  size integer,
  type text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null,
  edited_at timestamp with time zone
);

-- Create edit_history table
create table edit_history (
  id uuid default uuid_generate_v4() primary key,
  image_id uuid references images(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  operation_type text not null,
  parameters jsonb default '{}'::jsonb,
  timestamp timestamp with time zone default now() not null
);

-- Create subscriptions table
create table subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  stripe_subscription_id text not null,
  stripe_price_id text not null,
  plan_name text not null,
  status text not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create usage_limits table
create table usage_limits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  feature text not null,
  limit_value integer not null,
  usage_count integer default 0 not null,
  reset_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique (user_id, feature)
);

-- Set up Row Level Security (RLS) policies

-- Profiles table policies
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- Images table policies
alter table images enable row level security;

create policy "Users can view their own images"
  on images for select
  using (auth.uid() = user_id);

create policy "Users can insert their own images"
  on images for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own images"
  on images for update
  using (auth.uid() = user_id);

create policy "Users can delete their own images"
  on images for delete
  using (auth.uid() = user_id);

-- Edit history table policies
alter table edit_history enable row level security;

create policy "Users can view their own edit history"
  on edit_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own edit history"
  on edit_history for insert
  with check (auth.uid() = user_id);

-- Subscriptions table policies
alter table subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

-- Usage limits table policies
alter table usage_limits enable row level security;

create policy "Users can view their own usage limits"
  on usage_limits for select
  using (auth.uid() = user_id);

create policy "Users can update their own usage limits"
  on usage_limits for update
  using (auth.uid() = user_id);

-- Create functions and triggers

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update updated_at on profiles
create trigger update_profiles_updated_at
before update on profiles
for each row
execute function update_updated_at_column();

-- Trigger to update updated_at on subscriptions
create trigger update_subscriptions_updated_at
before update on subscriptions
for each row
execute function update_updated_at_column();

-- Trigger to update updated_at on usage_limits
create trigger update_usage_limits_updated_at
before update on usage_limits
for each row
execute function update_updated_at_column();

-- Function to create a profile after a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, subscription_tier)
  values (new.id, new.raw_user_meta_data->>'name', 'free');
  
  -- Create default usage limits for free tier
  insert into public.usage_limits (user_id, feature, limit_value, reset_at)
  values (new.id, 'edits', 5, (now() + interval '1 month'));
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create a profile after a user signs up
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- Function to update subscription tier when subscription changes
create or replace function public.handle_subscription_change()
returns trigger as $$
begin
  -- Update the user's subscription tier based on the plan
  update public.profiles
  set subscription_tier = 
    case 
      when new.plan_name = 'Pro' then 'pro'
      when new.plan_name = 'Premium' then 'premium'
      else 'free'
    end,
    updated_at = now()
  where id = new.user_id;
  
  -- Update or create usage limits based on the plan
  if new.status = 'active' then
    -- For active subscriptions, set appropriate limits
    if new.plan_name in ('Pro', 'Premium') then
      -- Pro and Premium have unlimited edits
      insert into public.usage_limits (user_id, feature, limit_value, usage_count, reset_at)
      values (new.user_id, 'edits', -1, 0, null)
      on conflict (user_id, feature) 
      do update set limit_value = -1, reset_at = null, updated_at = now();
    else
      -- Free tier has limited edits
      insert into public.usage_limits (user_id, feature, limit_value, reset_at)
      values (new.user_id, 'edits', 5, (now() + interval '1 month'))
      on conflict (user_id, feature) 
      do update set limit_value = 5, reset_at = (now() + interval '1 month'), updated_at = now();
    end if;
  else
    -- For canceled/inactive subscriptions, revert to free tier limits
    insert into public.usage_limits (user_id, feature, limit_value, reset_at)
    values (new.user_id, 'edits', 5, (now() + interval '1 month'))
    on conflict (user_id, feature) 
    do update set limit_value = 5, reset_at = (now() + interval '1 month'), updated_at = now();
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to update subscription tier when subscription changes
create trigger on_subscription_change
after insert or update on public.subscriptions
for each row
execute function public.handle_subscription_change();

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Set up storage policies
create policy "Images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Users can upload their own images"
  on storage.objects for insert
  with check (bucket_id = 'images' and auth.uid() = owner);

create policy "Users can update their own images"
  on storage.objects for update
  using (bucket_id = 'images' and auth.uid() = owner);

create policy "Users can delete their own images"
  on storage.objects for delete
  using (bucket_id = 'images' and auth.uid() = owner);

