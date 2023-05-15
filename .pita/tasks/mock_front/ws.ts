import { serve } from 'https://deno.land/x/websocket_server@1.0.2/mod.ts'
import {
	Foras,
	gzip,
} from 'https://deno.land/x/denoflate@2.0.8/src/deno/mod.ts'
import { colorize } from 'https://deno.land/x/json_colorizer@0.1.1/mod.ts'

Foras.initSyncBundledOnce()

for await (const { event, socket } of serve(':9002')) {
	try {
		const message = JSON.parse(event.toString()) as Message
		console.log(
			`%c[client] %crecieving "${Object.keys(message).join(', ')}"`,
			'color: royalblue; font-weight: bold',
			'color: white; font-weight: normal',
		)
		console.log(colorize(JSON.stringify(message, null, 2)))
		for (const mock of mockMessage(message)) {
			socket.send(gzipJson(mock))
		}
	} catch (error) {
		console.error(
			`%c❌ [ws] %c${String(error)}`,
			'color: tomato; font-weight: bold',
			'color: black',
		)
	}
}

function gzipJson(data: Message): Uint8Array {
	// return new TextEncoder().encode(JSON.stringify(data))
	return gzip(new TextEncoder().encode(JSON.stringify(data)))
}

type Message<T extends 'signals' | 'parameters' | undefined = undefined> =
	T extends 'signals' ? Signals
		: T extends 'parameters' ? Parameters
		: Signals | Parameters
type Signals = { signals: Record<string, SignalDatas> }
type SignalDatas = { size: number; value: number[] }
type Parameters = { parameters: Record<string, ParameterDatas> }
type ParameterDatas = { value: number | boolean }

function* mockMessage(
	datas: Message,
): Generator<Signals | Parameters, void, unknown> {
	if ('signals' in datas) {
		for (
			const [type, mapped] of Object.entries(datas.signals).map(
				mockSignals,
			)
		) {
			yield { [type]: Object.fromEntries([mapped]) } as Message<
				typeof type
			>
		}
	} else if ('parameters' in datas) {
		for (
			const [type, mapped] of Object.entries(datas.parameters).map(
				mockParameters,
			)
		) {
			yield { [type]: Object.fromEntries([mapped]) } as Message<
				typeof type
			>
		}
	} else {
		throw new TypeError(
			`unknown datas key(s) ${
				Object.keys(datas).filter((key) =>
					key !== 'signals' && key !== 'parameters'
				).join(', ')
			}`,
		)
	}
}

type Mock = ['signals', [string, SignalDatas]] | [
	'parameters',
	[string, ParameterDatas],
]

//deno-lint-ignore no-unused-vars
function mockSignals([key, datas]: [string, SignalDatas]): Mock {
	if (key === 'ai_0_signal') {
		return ['signals', ['ai_0_signal', { size: 1, value: [0] }]]
	}
	throw new Error(`"${key}" mock is not implemented`)
}

function mockParameters([key, datas]: [string, ParameterDatas]): Mock {
	if (key === 'AI_0') {
		return ['signals', ['AI_0', { size: 1, value: [Math.random()] }]]
	}
	if (key.startsWith('LED_')) {
		return ['parameters', [key, datas]]
	}
	throw new Error(`"${key}" mock is not implemented`)
}
