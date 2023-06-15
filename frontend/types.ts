import { JSX } from 'preact'

export type JsonValue = boolean | number | string | null | JsonValue[] | {
	[key: string]: JsonValue
}

export type Builder<T extends JSXFunction = JSXFunction> = {
	props: BuilderPropsOf<T>
	render: <U extends BuilderRenderProps<T>>(props: U) => ReturnType<T>
}

type BuilderRenderProps<T extends JSXFunction> = {
	[k in keyof Parameters<T>[0]]: JsonValue
}

type BuilderPropsOf<T extends JSXFunction> = {
	[k in keyof Parameters<T>[0]]: BuilderPropsInputs
}

type BuilderPropsInputs =
	| { type: 'text'; accept?: string }
	| { type: 'number' | 'range'; min: number; max: number; step: number }
	| { type: 'select'; options: (string | number)[] }

type JSXFunction = (props: Record<string, unknown>) => JSX.Element
