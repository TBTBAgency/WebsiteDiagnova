import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        diagnova: {
          blue: "#345DAB",
          dark: "#1D3F82",
          navy: "#0E234B",
          deep: "#08152E",
          light: "#CAE2F1",
          ice: "#EAF3FA",
        },
        nova: {
          blue: "#56ADE2",
          light: "#97CFEE",
          dark: "#2A82B8",
        },
      },
      backgroundImage: {
        "diagnova-gradient": "linear-gradient(135deg, #345DAB 0%, #56ADE2 100%)",
        "diagnova-gradient-dark": "linear-gradient(135deg, #0E234B 0%, #1D3F82 50%, #345DAB 100%)",
        "diagnova-gradient-glow": "radial-gradient(circle at 50% 50%, rgba(86, 173, 226, 0.15) 0%, rgba(52, 93, 171, 0.05) 50%, transparent 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sora)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
