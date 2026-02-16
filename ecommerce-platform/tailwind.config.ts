import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/tools/**/*.{js,ts,jsx,tsx,mdx}", // Explicitly included for Windows consistency
        "./src/app/qr/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/ads/**/*.{js,ts,jsx,tsx,mdx}", // Explicitly included for safety
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            colors: {
                primary: 'var(--primary)',
                secondary: 'var(--secondary)',
                accent: 'var(--accent)',
                background: 'var(--background)',
                surface: 'var(--surface)',
                text: 'var(--text)',
                'text-light': 'var(--text-light)',
                border: 'var(--border)',
            },
        },
    },
    plugins: [],
};
export default config;
