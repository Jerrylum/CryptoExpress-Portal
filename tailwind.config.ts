import type { Config } from "tailwindcss";

const primaryColor = {
  50: "#fbfbfb",
  100: "#dbdbdb",
  200: "#ababab",
  300: "#8b8b8b",
  400: "#7b7b7b",
  500: "#6b6b6b",
  600: "#5b5b5b",
  700: "#4b4b4b",
  800: "#3b3b3b",
  900: "#2b2b2b",
};

const config: Config = {
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // cyan is used in all components as the default "primary" color
        // here we are actually overriding it to our theme color
        // so practically, the cyan means primary
        primary: primaryColor,
        cyan: primaryColor,
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
export default config;
