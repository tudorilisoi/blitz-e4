// see https://www.tailwind-kit.com/started

module.exports = {
  important: false,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US",
  },

  content: ["./{src,app,pages}/**/*.{js,ts,jsx,tsx}"],
  // These options are passed through directly to PurgeCSS

  theme: {
    extend: {
      flexGrow: {
        2: "2",
        3: "3",
      },
    },
  },

  daisyui: {
    // themes: ["light", "dark", "cupcake"],

    // NOTE see https://daisyui.com/theme-generator/
    themes: [
      // "light",
      {
        "e3-dark": {
          "color-scheme": "dark",
          // NOTE may extend or just provide the required colors below
          // ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          // these are required, the others are generated
          // TODO read about the semantics here: https://daisyui.com/docs/colors/#-2
          primary: "#303f9f",
          secondary: "teal",
          accent: "#06b6d4",
          neutral: "#444",
          error: "#dc2828",
          "base-100": "#222",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  future: {
    purgeLayersByDefault: true,
  },
}
