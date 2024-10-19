/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Text Colors
        primarytext: 'var(--color-text-primary)',
        secondarytext: 'var(--color-text-secondary)',
        mutedtext: 'var(--color-text-muted)',

        // Background Colors
        bgdarker: 'var(--color-bg-darker)',
        bgdark: 'var(--color-bg-dark)',
        bglight: 'var(--color-bg-light)',

        // Action/State Colors
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        hoverprimary: 'var(--color-hover-primary)',

        // Additional Colors
        error: 'var(--color-error)',
        errormuted: 'var(--color-error-muted)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        muted: 'var(--color-muted)',
        slightmuted: 'var(--color-slight-muted)',
        darkmuted: 'var(--color-muted-dark)',

        // Kaffin's
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
