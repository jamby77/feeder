import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        tikTak: {
          "50%": { transform: "rotate(190deg)" },
          "100%": { transform: "rotate(-10deg)" },
        },
      },
      animation: {
        tikTak: "tikTak 4s linear infinite",
      },
      spacing: {
        topBar: "var(--top-bar-height)",
      },
      maxHeight: {
        "screen-top": "calc(100vh - var(--top-bar-height))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
export default config;
