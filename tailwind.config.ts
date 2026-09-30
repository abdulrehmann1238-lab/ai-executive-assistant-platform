import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{css,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        sunken: "var(--sunken)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        line: {
          DEFAULT: "var(--line)",
          2: "var(--line-2)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          h: "var(--primary-h)",
          a: "var(--primary-a)",
          t: "var(--primary-t)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "#E4DED1",
        },
        accent: {
          DEFAULT: "var(--accent)",
          t: "var(--accent-t)",
        },
        success: {
          DEFAULT: "var(--success)",
          t: "#E2EFE7",
        },
        warning: {
          DEFAULT: "var(--warning)",
          t: "#F6EBD3",
        },
        error: {
          DEFAULT: "var(--error)",
          t: "#F6E1DD",
        },
        info: {
          DEFAULT: "var(--info)",
          t: "#E1EAF1",
        },
      },
      borderRadius: {
        xs: "var(--r-xs)",
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        full: "var(--r-full)",
      },
      boxShadow: {
        "sh-1": "var(--sh-1)",
        "sh-2": "var(--sh-2)",
        "sh-3": "var(--sh-3)",
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Hanken Grotesk", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        med: "var(--dur-med)",
        slow: "var(--dur-slow)",
        scene: "var(--dur-scene)",
      },
      transitionTimingFunction: {
        "ease-out-custom": "cubic-bezier(0.22, 0.61, 0.36, 1)",
        "ease-in-out-custom": "cubic-bezier(0.65, 0.05, 0.36, 1)",
        "ease-emph-custom": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      zIndex: {
        sticky: "20",
        nav: "30",
        drawer: "50",
        modal: "60",
        toast: "70",
        tooltip: "80",
        loader: "100",
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1600px",
      },
    },
  },
  plugins: [],
};
export default config;
