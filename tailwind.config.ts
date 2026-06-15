import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:           '#0A0A0A',
        surface:          '#141414',
        'surface-raised': '#1C1C1C',
        accent:           '#C8922A',
        'accent-hover':   '#E0A83C',
        primary:          '#F5F0E8',
        secondary:        '#9A9080',
        tertiary:         '#5A5248',
        border:           '#2A2A2A',
        'border-hover':   '#3A3A3A',
        success:          '#4CAF50',
        error:            '#E57373',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        input: '6px',
        card:  '12px',
        pill:  '20px',
      },
    },
  },
  plugins: [],
} satisfies Config;
