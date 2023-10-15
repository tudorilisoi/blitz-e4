// @see https://www.tailwind-kit.com/started

module.exports = {
  important: true,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },

  content: ["./{src,app,pages}/**/*.{js,ts,jsx,tsx}"],
  // These options are passed through directly to PurgeCSS

  daisyui: {
    // themes: ["light", "dark", "cupcake"],
    themes: ["light"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  future: {
    purgeLayersByDefault: true,
  },
}
