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
        background: '#020203', // Very dark, almost black
        foreground: '#e0e0e0', // Off-white
        primary: '#A100FF',    // Vibrant purple
        secondary: '#3F3F46',  // Dark gray/zinc
        accent: '#FFFFFF',     // Bright white
      },
    },
  },
  plugins: [],
}
export default config
