/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      colors: {
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        muted: 'var(--text-muted)',
        secondary: 'var(--text-secondary)',
        card: 'var(--bg-card)',
        border: 'var(--border)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      animation: {
        'pin-reveal': 'pinReveal 0.5s forwards',
        'fade-in': 'fadeIn 0.3s',
        'modal-slide': 'modalSlide 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        pinReveal: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalSlide: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
