import { useEffect, useState } from 'preact/hooks'
import { Button } from '../components/Button.tsx'
import { NumericDisplay } from '../components/NumericDisplay.tsx'
import { Panel } from '../components/Panel.tsx'
import { App } from '../src/project.ts'
import { StateOf } from '../src/utils.ts'
import { JsonValue, SignalsConfig } from '../types.ts'

export function NumericMonitor<
	State extends JsonValue,
	Signals extends SignalsConfig,
	Key extends keyof App<State, Signals>['state'],
>({ title, app, state, signal, unit, precision }: {
	title: string
	app: App<State, Signals>
	state: StateOf<State, Key, boolean>
	signal: keyof App<State, Signals>['signals']
	unit: string
	precision: number
}) {
	const [toggleRead, setToggleRead] = useState(false)
	const [signalValue, setSignalValue] = useState(
		app.signals[signal]?.value[0] ?? NaN,
	)

	useEffect(() => {
		//@ts-ignore fix type
		if (app.isReady) app.state[state] = toggleRead
	}, [toggleRead])

	function updateSignalValue() {
		if (!toggleRead) return
		setSignalValue(app.signals[signal]?.value[0] ?? NaN)
		requestAnimationFrame(updateSignalValue)
	}
	requestAnimationFrame(updateSignalValue)

	return (
		<Panel title={title} size={[1, 1]}>
			<NumericDisplay
				value={signalValue}
				unit={unit}
				precision={precision}
			/>
			<Button
				variant='primary'
				onClick={() => {
					setToggleRead(!toggleRead)
					requestAnimationFrame(updateSignalValue)
				}}
			>
				{toggleRead ? 'Stop' : 'Read'}
			</Button>
		</Panel>
	)
}
