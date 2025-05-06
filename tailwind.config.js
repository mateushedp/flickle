/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./app/**/*.{js,ts,jsx,tsx}",
	  "./pages/**/*.{js,ts,jsx,tsx}",
	  "./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
			fontFamily: {
		  		antonio: ["Antonio", "sans-serif"],
				allerta: ["Allerta", "sans-serif"],
				pacifico: ["Pacifico", "sans-serif"]
			},
	  },
	},
	plugins: [],
};