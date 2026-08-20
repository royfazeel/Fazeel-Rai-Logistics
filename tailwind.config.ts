import type { Config } from 'tailwindcss'

/**
 * Rai Logistics design tokens.
 *
 * Brand direction (2026 redesign): industrial trucking look — charcoal ink,
 * signal red, steel blue. Red is the action color (buttons, fees, accents),
 * blue is the secondary brand color (links, info highlights), ink replaces
 * the old navy for text and dark sections.
 *
 * NOTE: scale names (primary/accent/navy/surface) are kept from the old
 * theme on purpose — every component in the codebase references them, so
 * redefining the values here re-skins the whole site in one place.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Signal red — primary action color
        primary: {
          50: '#FDF3F3',
          100: '#FBE4E5',
          200: '#F8CDCF',
          300: '#F1A5A8',
          400: '#E76F74',
          500: '#D94046',
          600: '#C8232C',
          700: '#A61A22',
          800: '#89191F',
          900: '#721B20',
          950: '#3E0B0E',
        },
        // Steel blue — secondary brand color
        accent: {
          50: '#F0F7FE',
          100: '#DEEDFB',
          200: '#C4E1F8',
          300: '#9BCEF3',
          400: '#6BB3EB',
          500: '#4897E0',
          600: '#1581C6',
          700: '#1268A3',
          800: '#135786',
          900: '#164A6F',
          950: '#0F2F4A',
        },
        // Ink — charcoal for text and dark sections (keeps the old "navy" name)
        navy: {
          50: '#F5F6F8',
          100: '#EBEDF1',
          200: '#D3D7DF',
          300: '#ACB4C1',
          400: '#7E879C',
          500: '#5E687E',
          600: '#4A5266',
          700: '#3D4453',
          800: '#343A46',
          900: '#23272F',
          950: '#14161C',
        },
        // Neutral surfaces
        surface: {
          50: '#F7F8FA',
          100: '#F1F3F6',
          200: '#E5E8ED',
          300: '#D2D7DE',
          400: '#B4BBC7',
          500: '#959EAD',
          600: '#79828F',
          700: '#666E7B',
          800: '#565C67',
          900: '#484D55',
          950: '#2E3138',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(20, 22, 28, 0.06), 0 4px 14px rgba(20, 22, 28, 0.05)',
        'medium': '0 2px 6px rgba(20, 22, 28, 0.07), 0 12px 28px rgba(20, 22, 28, 0.09)',
        'strong': '0 8px 22px rgba(20, 22, 28, 0.14), 0 20px 48px rgba(20, 22, 28, 0.14)',
      },
    },
  },
  plugins: [],
}

export default config
