import { Button, NumericDisplay, Panel } from '@components'
import { IO, IOMode, IOType } from 'pita_api'
import { useEffect, useState } from 'preact/hooks'

export function NumericMonitor({ title, pin, unit, precision }: {
	title: string
	pin: IO<IOMode.RO | IOMode.RW, IOType.Analog>
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
		if (!pin.getActive()) return
		setSignalValue(await pin.read())
		requestAnimationFrame(updateSignalValue)
	}

	return (
		<Panel title={title} size={[1, 1]}>
			<NumericDisplay
				value={signalValue}
				unit={unit}
				precision={precision}
			/>
			<Button
				variant='primary'
				onClick={async () => {
					setActive(!active)
					await pin.setActive(!active)
					requestAnimationFrame(updateSignalValue)
				}}
			>
				{active ? 'Stop' : 'Read'}
			</Button>
		</Panel>
	)
}
