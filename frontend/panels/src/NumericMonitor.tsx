import { useState, useEffect } from 'preact/hooks'
import { Panel, NumericDisplay, Button } from '@components'
import { IO, IOMode, IOType } from "pita_api";

export function NumericMonitor({ title, pin, unit, precision }: {
	title: string
	pin: IO<IOMode.RO | IOMode.RW, IOType.Analog>,
	unit: string
	precision: number
}) {
	const [active, setActive] = useState(false)
	const [signalValue, setSignalValue] = useState(NaN)

	useEffect(() => {
		return () => {
			pin.setActive(false)
		}
	}, [])

	async function updateSignalValue() {
		if (!pin.getActive()) {
			await pin.setActive(true)
		}
		if (!active) return
		setSignalValue(await pin.read())
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
					setActive(!active)
					requestAnimationFrame(updateSignalValue)
				}}
			>
				{active ? 'Stop' : 'Read'}
			</Button>
		</Panel>
	)
}
