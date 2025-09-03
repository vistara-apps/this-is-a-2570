# PixelFlow AI API Reference

This document provides a comprehensive reference for all the APIs used in the PixelFlow AI application.

## Table of Contents

1. [Perfect Corp. YouCam Online Editor API](#perfect-corp-youcam-online-editor-api)
2. [ApyHub Image Filter API](#apyhub-image-filter-api)
3. [OpenAI DALL-E 3 API](#openai-dall-e-3-api)
4. [Supabase API](#supabase-api)
5. [Stripe API](#stripe-api)

---

## Perfect Corp. YouCam Online Editor API

Perfect Corp. YouCam Online Editor API provides core image editing capabilities including clarity enhancement and background removal.

**API Documentation:** [https://www.perfectcorp.com/business/blog/photo-editing/ai-image-api](https://www.perfectcorp.com/business/blog/photo-editing/ai-image-api)

### Authentication

All requests to the Perfect Corp API require an API key for authentication. The API key should be included in the `Authorization` header of each request.

```javascript
headers: {
  'Authorization': `Bearer ${API_KEY}`
}
```

### Endpoints

#### Image Edit

Apply basic adjustments to an image.

- **URL:** `/image/edit`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `image` (File, required): The image file to edit
  - `brightness` (Number, optional): Brightness adjustment value (-100 to 100)
  - `contrast` (Number, optional): Contrast adjustment value (-100 to 100)
  - `saturation` (Number, optional): Saturation adjustment value (-100 to 100)
- **Response:** Image file (binary)

#### Background Removal

Remove the background from an image.

- **URL:** `/image/background/remove`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `image` (File, required): The image file to process
  - `transparentBackground` (Boolean, optional): Whether to make background transparent (default) or white
- **Response:** Image file with transparent background (binary)

#### Image Enhancement

Enhance an image using AI.

- **URL:** `/image/enhance`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `image` (File, required): The image file to enhance
  - `intensity` (Number, optional): Enhancement intensity (1-100)
- **Response:** Enhanced image file (binary)

---

## ApyHub Image Filter API

ApyHub Image Filter API provides artistic filters and adjustments like brightness, contrast, saturation.

**API Documentation:** [https://apyhub.com/blog/top-image-editing-apis-2025](https://apyhub.com/blog/top-image-editing-apis-2025)

### Authentication

All requests to the ApyHub API require an API key for authentication. The API key should be included in the `Authorization` header of each request.

```javascript
headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Accept': 'image/*'
}
```

### Endpoints

#### Apply Filter

Apply an artistic filter to an image.

- **URL:** `/image/filter`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `image` (File, required): The image file to process
  - `filter` (String, required): The type of filter to apply (e.g., 'sepia', 'grayscale', 'vintage')
  - `intensity` (Number, optional): Filter intensity (0-100)
- **Response:** Filtered image file (binary)

#### Apply Adjustments

Apply multiple adjustments to an image in a single request.

- **URL:** `/image/adjust`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `image` (File, required): The image file to process
  - `brightness` (Number, optional): Brightness adjustment (-100 to 100)
  - `contrast` (Number, optional): Contrast adjustment (-100 to 100)
  - `saturation` (Number, optional): Saturation adjustment (-100 to 100)
  - `sharpness` (Number, optional): Sharpness adjustment (0 to 100)
- **Response:** Adjusted image file (binary)

#### Get Available Filters

Get a list of all available filters.

- **URL:** `/image/filters`
- **Method:** `GET`
- **Response:** JSON array of available filters

---

## OpenAI DALL-E 3 API

OpenAI DALL-E 3 API provides image generation and advanced editing/manipulation capabilities.

**API Documentation:** [https://platform.openai.com/docs/guides/images](https://platform.openai.com/docs/guides/images)

### Authentication

All requests to the OpenAI API require an API key for authentication. The API key should be included in the `Authorization` header of each request.

```javascript
headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}
```

### Endpoints

#### Generate Images

Generate an image based on a text prompt.

- **URL:** `/v1/images/generations`
- **Method:** `POST`
- **Parameters:**
  - `model` (String, required): The model to use (e.g., "dall-e-3")
  - `prompt` (String, required): The text description of the image to generate
  - `n` (Number, optional): Number of images to generate (1-10)
  - `size` (String, optional): Image size ("1024x1024", "1024x1792", "1792x1024")
  - `quality` (String, optional): Image quality ("standard", "hd")
  - `style` (String, optional): Image style ("vivid", "natural")
- **Response:** JSON object containing generated image URLs

#### Edit Images

Edit an existing image based on a text prompt.

- **URL:** `/v1/images/edits`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `image` (File, required): The image file to edit
  - `prompt` (String, required): The text description of the edits to make
  - `n` (Number, optional): Number of images to generate (1-10)
  - `size` (String, optional): Image size ("1024x1024", "1024x1792", "1792x1024")
- **Response:** JSON object containing edited image URLs

#### Create Variations

Create variations of an existing image.

- **URL:** `/v1/images/variations`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `image` (File, required): The image file to create variations of
  - `n` (Number, optional): Number of variations to generate (1-10)
  - `size` (String, optional): Image size ("1024x1024", "1024x1792", "1792x1024")
- **Response:** JSON object containing variation image URLs

---

## Supabase API

Supabase API provides backend-as-a-service for user authentication, image storage, and metadata management.

**API Documentation:** [https://supabase.com/docs/reference/javascript](https://supabase.com/docs/reference/javascript)

### Authentication

Supabase uses JWT tokens for authentication. The token is automatically included in requests made through the Supabase client.

```javascript
const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Endpoints

#### Authentication

- **Sign Up:** `supabase.auth.signUp()`
- **Sign In:** `supabase.auth.signInWithPassword()`
- **Sign Out:** `supabase.auth.signOut()`
- **Get Session:** `supabase.auth.getSession()`
- **Get User:** `supabase.auth.getUser()`
- **Update User:** `supabase.auth.updateUser()`

#### Database

- **Select Data:** `supabase.from('table').select()`
- **Insert Data:** `supabase.from('table').insert()`
- **Update Data:** `supabase.from('table').update()`
- **Delete Data:** `supabase.from('table').delete()`

#### Storage

- **Upload File:** `supabase.storage.from('bucket').upload()`
- **Download File:** `supabase.storage.from('bucket').download()`
- **Get Public URL:** `supabase.storage.from('bucket').getPublicUrl()`
- **List Files:** `supabase.storage.from('bucket').list()`
- **Delete File:** `supabase.storage.from('bucket').remove()`

---

## Stripe API

Stripe API handles subscription payments and manages user billing.

**API Documentation:** [https://stripe.com/docs/api](https://stripe.com/docs/api)

### Authentication

All requests to the Stripe API require an API key for authentication. The API key should be included in the `Authorization` header of each request.

```javascript
headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}
```

### Endpoints

#### Create Checkout Session

Create a checkout session for subscription purchase.

- **URL:** `/v1/checkout/sessions`
- **Method:** `POST`
- **Parameters:**
  - `success_url` (String, required): URL to redirect to after successful payment
  - `cancel_url` (String, required): URL to redirect to if payment is canceled
  - `payment_method_types` (Array, required): Payment methods to accept
  - `mode` (String, required): Mode of the checkout session (subscription, payment)
  - `line_items` (Array, required): Items to purchase
  - `customer_email` (String, optional): Customer's email address
- **Response:** JSON object containing checkout session details

#### Create Customer Portal Session

Create a customer portal session for managing subscriptions.

- **URL:** `/v1/billing_portal/sessions`
- **Method:** `POST`
- **Parameters:**
  - `customer` (String, required): The ID of the customer
  - `return_url` (String, required): The URL to which the customer will be redirected after leaving the portal
- **Response:** JSON object containing portal session details

#### Create Subscription

Create a subscription for a customer.

- **URL:** `/v1/subscriptions`
- **Method:** `POST`
- **Parameters:**
  - `customer` (String, required): The ID of the customer
  - `items` (Array, required): The list of items to subscribe to
  - `payment_behavior` (String, optional): Payment behavior for the subscription
  - `payment_settings` (Object, optional): Payment settings for the subscription
  - `expand` (Array, optional): List of properties to expand
- **Response:** JSON object containing subscription details

#### Cancel Subscription

Cancel a subscription.

- **URL:** `/v1/subscriptions/{subscription_id}`
- **Method:** `DELETE`
- **Parameters:**
  - `subscription_id` (String, required): The ID of the subscription to cancel
  - `cancel_at_period_end` (Boolean, optional): Whether to cancel at the end of the billing period
- **Response:** JSON object containing canceled subscription details

#### Update Subscription

Update a subscription.

- **URL:** `/v1/subscriptions/{subscription_id}`
- **Method:** `POST`
- **Parameters:**
  - `subscription_id` (String, required): The ID of the subscription to update
  - `items` (Array, optional): The list of items to update
  - `cancel_at_period_end` (Boolean, optional): Whether to cancel at the end of the billing period
  - `proration_behavior` (String, optional): Proration behavior for the subscription
- **Response:** JSON object containing updated subscription details

