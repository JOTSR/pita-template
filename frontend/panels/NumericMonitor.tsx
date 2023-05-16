import { useEffect, useState } from 'preact/hooks'
import { Button } from '@components/Button.tsx'
import { NumericDisplay } from '@components/NumericDisplay.tsx'
import { Panel } from '@components/Panel.tsx'
import { IO, IOMode, IOType } from "pita_api";

export function NumericMonitor({ title, pin, unit, precision }: {
	title: string
	pin: IO<IOMode.RO | IOMode.RW, IOType.Analog>,
	unit: string
	precision: number
}) {
	const [active, setActive] = useState(false)
	const [signalValue, setSignalValue] = useState(NaN)

	async function updateSignalValue() {
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
