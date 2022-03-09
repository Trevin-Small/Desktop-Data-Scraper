module.exports = {
  content: ["./src/index.html"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Helvetica Neue', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  plugins: [],
}