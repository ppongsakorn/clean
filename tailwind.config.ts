import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // shadcn-vue compatible CSS variable tokens
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          elevated: 'hsl(var(--elevated))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Brand
        gold: '#F9A601',
        bzb: {
          gold: '#F9A601',
          indigo: '#183E6C',
          blue: '#2365AA',
        },

        // Status
        status: {
          'in-progress': '#2365AA',
          planning: '#7C3AED',
          done: '#22C55E',
          cancelled: '#4A4A4A',
          backlog: '#64748B',
          review: '#F59E0B',
          overdue: '#EF4444',
        },

        // Priority
        priority: {
          critical: '#EF4444',
          high: '#F97316',
          normal: '#3B82F6',
          low: '#6B7280',
        },

        // Human:AI
        human: '#3B82F6',
        ai: '#8B5CF6',
      },

      fontFamily: {
        sans: ['Prompt', 'Inter', ...fontFamily.sans],
      },

      fontSize: {
        xs:   ['11px', { lineHeight: '1.4' }],
        sm:   ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.6' }],
        md:   ['16px', { lineHeight: '1.5' }],
        lg:   ['20px', { lineHeight: '1.4' }],
        xl:   ['24px', { lineHeight: '1.3' }],
        '2xl':['32px', { lineHeight: '1.2' }],
      },

      borderRadius: {
        sm:   '4px',
        DEFAULT: '8px',
        md:   '8px',
        lg:   '12px',
        full: '9999px',
      },

      boxShadow: {
        sm:   '0 1px 3px rgba(0,0,0,0.3)',
        md:   '0 4px 12px rgba(0,0,0,0.4)',
        lg:   '0 8px 24px rgba(0,0,0,0.5)',
        gold: '0 0 0 2px rgba(249,166,1,0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config
