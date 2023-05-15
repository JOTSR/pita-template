import { useEffect, useState } from 'preact/hooks'
import { Button } from '../components/Button.tsx'
import { Panel } from '../components/Panel.tsx'
import { App } from '../src/project.ts'
import { JsonValue } from '../types.ts'
import { StateOf } from '../src/utils.ts'

export function ToggleSwitch<
	State extends JsonValue,
	Key extends keyof App<State, undefined>['state'],
>(
	{ title, app, state, messageOn, messageOff }: {
		title: string
		app: App<State, undefined>
		state: StateOf<State, Key, boolean>
		messageOn: string
		messageOff: string
	},
) {
	const [toggleState, setToggleState] = useState(app.state[state])
	useEffect(() => {
		if (app.isReady) app.state[state] = toggleState
	}, [toggleState])

	return (
		<Panel title={title} size={[1, 1]}>
			<p>
				{toggleState ? messageOn : messageOff}
			</p>
			<Button
				variant='primary'
				//@ts-ignore fix type assertion
				onClick={() => setToggleState(!toggleState)}
			>
				Switch
			</Button>
		</Panel>
	)
}
