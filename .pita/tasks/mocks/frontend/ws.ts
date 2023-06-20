import { colorize } from 'https://deno.land/x/json_colorizer@0.1.1/mod.ts'
import {
	MessageData,
	MessageId,
	ParameterDatas,
	Parameters,
	SignalDatas,
	Signals,
} from 'https://deno.land/x/pita_api@0.6.1/types.ts'
import { serve } from 'https://deno.land/x/websocket_server@1.0.2/mod.ts'
import { random, randomInt } from 'https://deno.land/x/denum@v1.2.0/mod.ts'
//@ts-ignore e
const ds = new CompressionStream('gzip') as {
	readable: ReadableStream<Uint8Array>
	writable: WritableStream<ArrayBuffer>
}
const writer = ds.writable.getWriter()
const reader = ds.readable.getReader()

const analogInInterval: Map<string, number> = new Map()
let socketMain: WebSocket

for await (const { event, socket } of serve(':9002')) {
	//@ts-ignore temp
	socketMain = socket
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
			socket.send(await gzipJson(mock))
		}
	} catch (error) {
		console.error(
			`%c❌ [ws] %c${String(error)}`,
			'color: tomato; font-weight: bold',
			'color: white',
		)
	}
}

export async function gzipEncode(buffer: ArrayBuffer) {
	writer.write(buffer)
	const { value } = await reader.read()
	return value!
}

function gzipJson(data: MessageData): Promise<Uint8Array> {
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

type Mock = ['signals', [MessageId, SignalDatas]] | [
	'parameters',
	[MessageId, ParameterDatas],
]

function mockSignals([key, _datas]: [MessageId, SignalDatas]): Mock {
	if (key.startsWith('analog')) {
		return ['signals', [key, { size: 1, value: [0] }]]
	}
	throw new Error(`"${key}" mock is not implemented`)
}

function mockParameters([key, datas]: [MessageId, ParameterDatas]): Mock {
	if ((/analog_in_\d#active/).test(key)) {
		activateFakeSignal(socketMain, key, datas)
	}
	if (key.includes('#')) {
		return ['parameters', [key, datas]]
	}
	if (key.startsWith('analog')) {
		return ['signals', [key, { size: 1, value: [Math.random()] }]]
	}
	if (key.startsWith('digital')) {
		return ['parameters', [key, datas]]
	}
	throw new Error(`"${key}" mock is not implemented`)
}

function activateFakeSignal(
	socket: WebSocket,
	key: MessageId,
	datas: ParameterDatas,
) {
	if (datas.value && !analogInInterval.has(key)) {
		analogInInterval.set(
			key,
			setInterval(() => {
				const signal = random(0.8, 1.2) *
					Math.sin(Date.now() / randomInt(80, 120))
				console.log(
					`%c[ws] %csending signal (%c${signal}%c) to "${key}"`,
					'color: royalblue; font-weight: bold',
					'color: white; font-weight: normal',
					'color: gold; font-weight: bold',
					'color: white; font-weight: normal',
				)
				console.log()
				sendFakeSignal(socket, key.split('#')[0] as MessageId, [
					signal,
				])
			}, 500),
		)
	} else {
		clearInterval(analogInInterval.get(key))
		analogInInterval.delete(key)
	}
}

async function sendFakeSignal(
	socket: WebSocket,
	baseKey: MessageId,
	signal: number[],
) {
	socket.send(
		await gzipJson({
			'signals': {
				[baseKey]: {
					'size': signal.length,
					'value': signal,
				},
			},
		}),
	)
}
