import { JsonValue } from '../types.ts'
import { App } from './project.ts'

/**
 * Returns the first element that is a descendant of node that matches selectors.
 * @param {T} selectors - List of html selectors.
 * @returns First matching element.
 */
export const $ = <T extends Element = HTMLElement>(selectors: string) =>
	document.querySelector<T>(selectors)

/**
 * Returns all element descendants of node that match selectors.
 * @param {T} selectors - List of html selectors.
 * @returns Array of matching elements.
 */
export const $$ = <T extends Element = HTMLElement>(selectors: string) =>
	Array.from(document.querySelectorAll<T>(selectors))

/**
 * Throws an error if value is null or undefined.
 * @param {T} value - Value to ensure assignation.
 * @returns Strictely defined value.
 */
export function required<T extends unknown>(value: T) {
	if (value === undefined || value === null) {
		throw new TypeError('Value is undefined')
	}
	return value
}

export const sessionValueStorage = {
	/**
	 * Session storage proxy to work directly with json values.
	 * Set json value in session storage.
	 * @param {srting} name Storage key.
	 * @param {T} value Storage value (must be json compatible).
	 */
	setItem<T = unknown>(name: string, value: T): void {
		sessionStorage.setItem(name, JSON.stringify({ value }))
	},
	/**
	 * Session storage proxy to work directly with json values.
	 * Get json value from session storage.
	 * @param {string} name Storage key.
	 * @param {T} defaultValue Default value if key don't exist.
	 * @returns Stored value or defaultValue if none.
	 */
	getItem<T = unknown>(name: string, defaultValue: T): T {
		const item = sessionStorage.getItem(name)
		if (item) return JSON.parse(item).value
		return defaultValue
	},
}

/**
 * Ungzip JSON datas.
 * @param {{ data: Uint8Array }} { data } - gzipped buffer
 * @returns JSON value.
 */
export async function ungzipJson<
	T extends Record<string, unknown> = Record<string, unknown>,
>({ data }: { data: Blob }): Promise<T> {
	const { value } = await data
		.stream()
		//@ts-ignore missing definition
		.pipeThrough(new DecompressionStream('gzip'))
		.pipeThrough(new TextDecoderStream())
		.getReader()
		.read()
	if (value === undefined) throw new TypeError('Empty buffer')
	return JSON.parse(value)
}

/**
 * The upwardSelector function returns the closest ancestor of a given element that matches a specified
 * selector.
 * The function will traverse up the DOM tree from the `source` element until it finds an element that matches the given selector(s).
 * @param {HTMLElement} source - The source parameter is an HTMLElement that serves as the starting
 * point for the upward search for the element that matches the given selectors.
 * @param {string} selectors - String that represents one or more CSS selectors.
 * @returns an HTMLElement that matches the provided selectors.
 */
export function upwardSelector<T extends HTMLElement = HTMLElement>(
	source: HTMLElement,
	selectors: string,
): T {
	let current = source
	while (!current.matches(selectors)) {
		current = current.parentElement!
	}
	return current as T
}

export const globalState = new Map<string, unknown>()

export type StateOf<
	T extends JsonValue,
	K extends keyof App<T, undefined>['state'],
	P,
> = App<T, undefined>['state'][K] extends P ? K : never

export const jsonStream = {
	parse<T extends Record<string, unknown>>() {
		return new TransformStream<string, T>({
			transform(chunk, controler) {
				try {
					controler.enqueue(JSON.parse(chunk))
				} catch (error) {
					controler.error(error)
				}
			},
		})
	},
	stringify<T extends Record<string, unknown>>() {
		return new TransformStream<T, string>({
			transform(chunk, controler) {
				try {
					controler.enqueue(JSON.stringify(chunk))
				} catch (error) {
					controler.error(error)
				}
			},
		})
	},
}
