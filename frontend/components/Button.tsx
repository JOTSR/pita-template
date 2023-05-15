import { JSX } from 'preact'

export function Button(
	{ variant, children, ...props }: JSX.HTMLAttributes<HTMLButtonElement> & {
		variant: 'secondary' | 'primary'
	},
) {
	return (
		<button className={`button button-${variant}`} {...props}>
			{children}
		</button>
	)
}
