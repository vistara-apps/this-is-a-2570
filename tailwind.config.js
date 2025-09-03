/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 36%, 96%)',
        accent: 'hsl(170, 70%, 45%)',
        primary: 'hsl(210, 80%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        textPrimary: 'hsl(210, 30%, 15%)',
        textSecondary: 'hsl(210, 20%, 40%)',
      },
      borderRadius: {
        'lg': '1rem',
        'md': '0.625rem',
        'sm': '0.375rem',
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'modal': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        'lg': '1.25rem',
        'md': '0.75rem',
        'sm': '0.5rem',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideIn': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}