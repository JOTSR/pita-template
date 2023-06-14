import { useState } from 'preact/hooks'

export function ColorSchemeToggle() {
	const currentScheme = matchMedia('(prefers-color-scheme: light)').matches
	const [colorScheme, setColorScheme] = useState(currentScheme)
	function updateColorScheme() {
		setColorScheme(!colorScheme)
		document.body.classList.add(
			`prefers-color-scheme-${colorScheme ? 'dark' : 'light'}`,
		)
		document.body.classList.remove(
			`prefers-color-scheme-${colorScheme ? 'light' : 'dark'}`,
		)
	}
	return (
		<i
			className={`ri-${colorScheme ? 'sun' : 'moon'}-line`}
			onClick={updateColorScheme}
		>
		</i>
	)
}
