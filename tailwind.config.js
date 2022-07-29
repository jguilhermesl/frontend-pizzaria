/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
		screens: {
			'phone': { 'max': '600px' },
			'tablet-min': { 'max': '760px' },
			'tablet': { 'max': '1000px' },
			'desktop': { 'max': '1279px' },
		},
    extend: {
			colors: {
				black: {
					600: '#282828',
					700: '#231f20',
					900: '#000'
				},
				yellow: {
					700: '#fede1a'
				},
				green: {
					700: '#3fffa3'
				},
				red: {
					700: '#ff3f4b'
				}
			}
		},
  },
  plugins: [],
}
