import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xsm: "375px",
      sm: "540px",
      md: "768px",
      lg: "1070px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        success: "#61C554",
        lightBg :"#131313",
        darkBg: "#000000",
        warning : "#CC3169",
        primary: "#FFFFFF",
        lightGray: "#B8B8B8",
        darkGrey: "#969696",
        // success: "#85E2FF",

      },
      fontFamily: {
        roboto: ["Roboto"],
      }
      
    },
  },
  plugins: [],
} satisfies Config;
