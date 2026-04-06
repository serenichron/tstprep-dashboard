/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					green: '#00b189',
					'green-light': '#e6f7f3',
					'green-dark': '#008f6e',
					pink: '#ff5859',
					'pink-light': '#fff0f0',
					'pink-dark': '#e04848'
				}
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif']
			},
			boxShadow: {
				card: '0 2px 12px rgba(0,0,0,0.07)'
			}
		}
	},
	plugins: []
};
