import { JsonValue, Tuple } from '../types.ts'
import { ungzipJson } from './utils.ts'

export type SignalsConfig = Record<string, number>
export type MessageData =
	| {
			signals: Record<string, unknown>
	  }
	| {
			parameters: Record<string, unknown>
	  }

export type Signals<T extends SignalsConfig> = {
	[K in keyof T]: { size: T[K]; value: Tuple<number, T[K]> }
}

/**
 * Project represent the host configuration.
 * @example
 * ```ts
 * const app = Project.init(projectConfig, initialState)
 * ```
 */
export class Project {
	static #config: Config
	/**
	 * This initializes an App from an UUID from the 🫓 pita project configuration and an initial state.
	 * It init the connection the backend.
	 * @param {{ uuid: string }} { uuid } - The 🫓 pita project uuid.
	 * @param {StateFormat} initialState - Initial state of the application is a JSON value. The type of the initial state determine the final App state type.
	 * @returns A new instance of App.
	 */
	static async init<
		StateFormat extends JsonValue | undefined,
		SignalsFormat extends SignalsConfig | undefined,
	>(
		{ uuid }: { uuid: string },
		initialState: StateFormat,
		_signals: SignalsFormat,
	): Promise<App<StateFormat, SignalsFormat>> {
		this.#config = {
			uuid,
			startEndpoint: `/bazaar?start=${uuid}?${
				location.search.substring(1)
			}`,
			wsEndpoint: `ws://${location.hostname}:9002`,
		}

		const response = await fetch(this.#config.startEndpoint)
		if (!response.ok) {
			throw new Error(
				`Unable to start the application, server respond with (${response.status}) ${response.statusText}`,
			)
		}

		const ws = new WebSocket(this.#config.wsEndpoint)

		return new App({
			config: this.#config,
			ws,
			state: initialState,
		})
	}

	/**
	 * @throws Static only class, "new" is not disponible
	 */
	constructor() {
		throw new TypeError('Static only class, "new" is not disponible')
	}
}

export type Config = {
	uuid: string
	startEndpoint: string
	wsEndpoint: string
}

/**
 * App is an abstraction of the local app running on the redpitaya. It expose a state synchronized with the backend.
 */
export class App<
	StateFormat extends JsonValue | undefined,
	SignalsFormat extends SignalsConfig | undefined,
> {
	#config: Config
	#ws: WebSocket
	#state: StateFormat
	#isReady = false
	#signals: Signals<SignalsConfig> = {}

	constructor(
		{ config, ws, state }: {
			config: Config
			ws: WebSocket
			state: State<StateFormat>
		},
	) {
		this.#config = structuredClone(config)
		this.#ws = ws
		this.#state = structuredClone(state)
		this.#ws.addEventListener('open', () => {
			this.#isReady = true
		})
		this.#ws.addEventListener('close', () => {
			this.#isReady = false
		})

		this.#ws.addEventListener('message', async (event) => {
			const data = await ungzipJson<MessageData>(event)
			if ('signals' in data && Object.keys(data.signals).length) {
				this.#signals = JSON.parse(
					JSON.stringify(data.signals).toLowerCase(),
				)
			}

			// if ('parameters' in data && Object.keys(data.parameters).length) {
			// 	console.log(data.parameters)
			// }
		})
	}

	/**
	 * App configuration.
	 */
	get config() {
		return this.#config
	}

	/**
	 * App current state.
	 */
	get state() {
		if (this.#state === undefined) {
			throw new TypeError('No state configured for current App')
		}
		const sendState = this.#sendState.bind(this)
		//@ts-ignore will be removed
		return new Proxy(this.#state, {
			set(state, key, value) {
				Reflect.set(state, key, value)
				sendState()
				return true
			},
		})
	}

	set state(state: State<StateFormat>) {
		this.#state = state
		this.#sendState()
	}

	/**
	 * Listen on app events ('message', 'error', 'close', 'open').
	 */
	get addEventListener() {
		return this.#ws.addEventListener.bind(this.#ws)
	}

	#sendState() {
		if (this.state === undefined) {
			throw new TypeError('No state configured for current App')
		}
		const local = Object.fromEntries(
			//@ts-ignore will be removed
			Object.entries(this.state).map((
				[key, value],
			) => [key.toUpperCase(), { value }]),
		)
		this.#ws.send(JSON.stringify({ parameters: local }))
	}

	/**
	 * True if frontend connected to backend.
	 */
	get isReady() {
		return this.#isReady
	}

	get signals(): Signals<SignalsConfig> {
		return JSON.parse(JSON.stringify(this.#signals))
	}
}

export type State<T extends JsonValue | undefined> = T
