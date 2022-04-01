module.exports = {
  content: ['./src/**/*.html', './src/**/*.svelte'],
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#f5f3ff', // 50
          lighter: '#ede9fe', // 100
          light: '#a78bfa', // 400
          base: '#8b5cf6', // 500
          dark: '#7c3aed', // 600
          darker: '#6d28d9', // 700
          darkest: '#4c1d95', // 900
        },
        default: {
          lightest: '#f8fafc', // 50
          lighter: '#f1f5f9', // 100
          light: '#94a3b8', // 400
          base: '#64748b', // 500
          dark: '#475569', // 600
          darker: '#334155', // 700
          darkest: '#0f172a', // 900
        },
        danger: {
          lightest: '#fef2f2', // 50
          lighter: '#fee2e2', // 100
          light: '#f87171', // 400
          base: '#ef4444', // 500
          dark: '#dc2626', // 600
          darker: '#b91c1c', // 700
          darkest: '#7f1d1d', // 900
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
