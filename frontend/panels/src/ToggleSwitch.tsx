import { IOMode, IOType, IO } from 'pita_api'
import { useEffect, useState } from 'preact/hooks'
import { Button, Panel } from '@components'

export function ToggleSwitch(
	{ title, pin, messageOn, messageOff }: {
		title: string
		pin: IO<IOMode.RW | IOMode.WO, IOType.Digital>
		messageOn: string
		messageOff: string
	},
) {
	const [state, setState] = useState(false)
	useEffect(() => {
		pin.write(state)
	}, [state])

	return (
		<Panel title={title} size={[1, 1]}>
			<p>
				{state ? messageOn : messageOff}
			</p>
			<Button
				variant='primary'
				onClick={() => setState(!state)}
			>
				Switch
			</Button>
		</Panel>
	)
}
