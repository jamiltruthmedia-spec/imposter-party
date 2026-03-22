import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1a1a2e',
        'navy-light': '#16213e',
        'navy-mid': '#0f3460',
        cyan: '#00d4ff',
        'cyan-dim': '#0099bb',
        imposter: '#ff4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.2)',
        'cyan-glow-sm': '0 0 10px rgba(0, 212, 255, 0.4)',
        'red-glow': '0 0 20px rgba(255, 68, 68, 0.5), 0 0 40px rgba(255, 68, 68, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config
