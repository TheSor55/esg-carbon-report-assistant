import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        carbon: {
          ink: '#17211b',
          muted: '#657064',
          line: '#dce4db',
          bg: '#f5f7f4',
          green: '#28724f',
          teal: '#147481',
          amber: '#a76516',
          danger: '#a33c2d'
        }
      },
      boxShadow: {
        soft: '0 18px 45px rgba(22, 37, 28, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
