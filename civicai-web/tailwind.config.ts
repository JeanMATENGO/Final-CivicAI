import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          danger: "#EF4444", // rouge
          alert: "#F59E0B",  // jaune
          success: "#10B981", // vert
          info: "#3B82F6",    // bleu
          dark: "#1F2937",
          light: "#F3F4F6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
