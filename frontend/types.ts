export type JsonValue = boolean | number | string | null | JsonValue[] | {
	[key: string]: JsonValue
}
