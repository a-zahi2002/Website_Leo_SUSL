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
                leo: {
                    gold: '#FDBE15',
                    maroon: '#800000',
                }
            }
        },
    },
    plugins: [],
}
