/// <reference path="https://raw.githubusercontent.com/Kingwl/core-dts/main/src/proposals/stage-2/index.d.ts" />
import 'core-js/stage/2'

import { $, $$, required } from '@/frontend/src/utils.ts'
import { Project } from '@/frontend/src/project.ts'
import { render } from 'preact'
import info from '@/www/info/info.json' assert { type: 'json' }
import project from '@pita/project.json' assert { type: 'json' }
import { ColorSchemeToggle } from '@components/ColorSchemeToggle.tsx'
import { ToggleSwitch } from '@panels/ToggleSwitch.tsx'
import { NumericMonitor } from '@panels/NumericMonitor.tsx'

const app = await Project.init(project, {
	led_0_state: false,
	led_1_state: false,
	led_2_state: false,
	led_3_state: false,
	led_4_state: false,
	led_5_state: false,
	led_6_state: false,
	led_7_state: false,
	ai_0: false,
}, { ai_0: 1 })
const main = required($('main'))
required($('title')).innerText = info.name

app.addEventListener('open', () => {
	required($('#connection-status')).innerHTML = '<i class="ri-link-m"></i>'
	required($('#connection-status')).classList.remove('connect-status-alert')
})
app.addEventListener('close', () => {
	required($('#connection-status')).innerHTML =
		'<i class="ri-link-unlink-m"></i>'
	required($('#connection-status')).classList.add('connect-status-alert')
})

app.addEventListener('error', (event) => {
	console.error('Websocket error: ', event)
})

render(
	<>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_0_state'
			messageOn='Led 1 is On'
			messageOff='Led 1 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_1_state'
			messageOn='Led 2 is On'
			messageOff='Led 2 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_2_state'
			messageOn='Led 3 is On'
			messageOff='Led 3 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_3_state'
			messageOn='Led 4 is On'
			messageOff='Led 4 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_4_state'
			messageOn='Led 5 is On'
			messageOff='Led 5 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_5_state'
			messageOn='Led 6 is On'
			messageOff='Led 6 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_6_state'
			messageOn='Led 7 is On'
			messageOff='Led 7 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			app={app}
			state='led_7_state'
			messageOn='Led 8 is On'
			messageOff='Led 8 is Off'
		/>
		<NumericMonitor
			title='Voltmeter'
			app={app}
			state='ai_0'
			signal='ai_0'
			unit='V'
			precision={5}
		/>
	</>,
	main,
)

//Initialize drag order
$$('.panel').map((panel, index) => panel.style.order = String(index))

render(<ColorSchemeToggle />, required($('#color-scheme-toggle')))
