/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#eff6ff',
					'100': '#dbeafe',
					'500': '#3b82f6',
					'600': '#2563eb',
					'700': '#1d4ed8',
					DEFAULT: 'rgb(var(--primary))',
					foreground: 'rgb(var(--primary-foreground))'
				},
				// Custom theme-aware colors
				'bg-primary': 'rgb(var(--bg-primary))',
				'bg-secondary': 'rgb(var(--bg-secondary))',
				'bg-card': 'rgb(var(--bg-card))',
				'text-primary': 'rgb(var(--text-primary))',
				'text-secondary': 'rgb(var(--text-secondary))',
				'text-muted': 'rgb(var(--text-muted))',
				'border-custom': 'rgb(var(--border))',
				// Existing shadcn/ui colors
				background: 'rgb(var(--background))',
				foreground: 'rgb(var(--foreground))',
				card: {
					DEFAULT: 'rgb(var(--card))',
					foreground: 'rgb(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'rgb(var(--popover))',
					foreground: 'rgb(var(--popover-foreground))'
				},
				secondary: {
					DEFAULT: 'rgb(var(--secondary))',
					foreground: 'rgb(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'rgb(var(--muted))',
					foreground: 'rgb(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'rgb(var(--accent))',
					foreground: 'rgb(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'rgb(var(--destructive))',
					foreground: 'rgb(var(--destructive-foreground))'
				},
				border: 'rgb(var(--border))',
				input: 'rgb(var(--input))',
				ring: 'rgb(var(--ring))',
				chart: {
					'1': 'rgb(var(--chart-1))',
					'2': 'rgb(var(--chart-2))',
					'3': 'rgb(var(--chart-3))',
					'4': 'rgb(var(--chart-4))',
					'5': 'rgb(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
