import { serve } from 'https://deno.land/x/websocket_server@1.0.2/mod.ts'
import { colorize } from 'https://deno.land/x/json_colorizer@0.1.1/mod.ts'
import { gzipEncode } from 'https://deno.land/x/wasm_gzip@v1.0.0/mod.ts' 
import { MessageData, Signals, SignalDatas, Parameters, ParameterDatas } from 'https://deno.land/x/pita_api@0.6.1/types.ts'

for await (const { event, socket } of serve(':9002')) {
	try {
		if (typeof event === 'object' && 'code' in event && 'reason' in event) {
			console.log(
				`%c⚠️ [client] %csocket closed with code ${event.code} due to "${event.reason}"`,
				'color: gold; font-weight: bold',
				'color: white; font-weight: normal',
			)
			continue
		}
		const message = JSON.parse(event.toString()) as MessageData
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
			'color: white',
		)
	}
}

function gzipJson(data: MessageData): Uint8Array {
	return gzipEncode(new TextEncoder().encode(JSON.stringify(data)))
}

function* mockMessage(
	datas: MessageData,
): Generator<Signals | Parameters, void, unknown> {
	if ('signals' in datas) {
		for (
			const [type, mapped] of Object.entries(datas.signals).map(
				//@ts-ignore to fix
				mockSignals,
			)
		) {
			yield { [type]: Object.fromEntries([mapped]) } as MessageData<
				typeof type
			>
		}
	} else if ('parameters' in datas) {
		for (
			const [type, mapped] of Object.entries(datas.parameters).map(
				//@ts-ignore to fix
				mockParameters,
			)
		) {
			yield { [type]: Object.fromEntries([mapped]) } as MessageData<
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

function mockSignals([key, _datas]: [string, SignalDatas]): Mock {
	if (key.startsWith('analog')) {
		return ['signals', [key, { size: 1, value: [0] }]]
	}
	throw new Error(`"${key}" mock is not implemented`)
}

function mockParameters([key, datas]: [string, ParameterDatas]): Mock {
	if (key.startsWith('analog')) {
		return ['signals', [key, { size: 1, value: [Math.random()] }]]
	}
	if (key.startsWith('digital')) {
		return ['parameters', [key, datas]]
	}
	throw new Error(`"${key}" mock is not implemented`)
}
