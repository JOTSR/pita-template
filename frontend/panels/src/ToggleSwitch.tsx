import { redpitaya } from '@/frontend/app.tsx'
import { Button, Panel } from '@components'
import { Builder } from '@types'
import { IO, IOMode, IOType } from 'pita_api'
import { useEffect, useState } from 'preact/hooks'

//@ts-ignore TODO fix generic
const builder: Builder<typeof ToggleSwitch> = {
	props: {
		title: { type: 'text' },
		pin: {
			type: 'select',
			options: [...Object.keys(redpitaya.pin.digital)],
		},
		messageOn: { type: 'text' },
		messageOff: { type: 'text' },
	},
	//@ts-ignore TODO fix generic
	render(
		{ title, messageOn, messageOff, pin }: {
			title: string
			messageOn: string
			messageOff: string
			pin: keyof typeof redpitaya.pin.digital
		},
	) {
		return (
			<ToggleSwitch
				title={title}
				messageOn={messageOn}
				messageOff={messageOff}
				pin={redpitaya.pin.digital[pin]}
			/>
		)
	},
}

export function ToggleSwitch(
	{ title, pin, messageOn, messageOff }: {
		title: string
		pin: IO<IOMode.RW | IOMode.WO, IOType.Digital>
		messageOn: string
		messageOff: string
	},
) {
	//@ts-ignore internal use
	ToggleSwitch.__builder__ = builder

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
