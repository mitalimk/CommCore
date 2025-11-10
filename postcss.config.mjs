const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Optional: define a custom purple if you want
        slackPurple: "#5C3B58",
      },
    },
  },
  plugins: [],
};