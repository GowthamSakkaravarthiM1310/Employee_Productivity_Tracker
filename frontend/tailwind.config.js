/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#3B82F6', // Blue-500
                    dark: '#1E40AF', // Blue-800
                },
                secondary: {
                    light: '#10B981', // Emerald-500
                    dark: '#065F46', // Emerald-800
                },
                darkBlue: {
                    950: '#020c1b',
                    900: '#031d33',
                    800: '#052a4a',
                }
            }
        },
    },
    plugins: [],
}
