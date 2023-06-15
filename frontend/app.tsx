import { redpitaya } from '@/frontend/src/redpitaya.ts'
import { NumericMonitor, ToggleSwitch } from '@panels'
import { $, $$, required } from '@utils'
import '@views'
import { render } from 'preact'

render(
	<>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led0}
			messageOn='Led 1 is On'
			messageOff='Led 1 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led1}
			messageOn='Led 2 is On'
			messageOff='Led 2 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led2}
			messageOn='Led 3 is On'
			messageOff='Led 3 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led3}
			messageOn='Led 4 is On'
			messageOff='Led 4 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led4}
			messageOn='Led 5 is On'
			messageOff='Led 5 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led5}
			messageOn='Led 6 is On'
			messageOff='Led 6 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led6}
			messageOn='Led 7 is On'
			messageOff='Led 7 is Off'
		/>
		<ToggleSwitch
			title='Led switch'
			pin={redpitaya.pin.digital.led7}
			messageOn='Led 8 is On'
			messageOff='Led 8 is Off'
		/>
		<NumericMonitor
			title='Voltmeter'
			pin={redpitaya.pin.analog.in1}
			unit='V'
			precision={5}
		/>
	</>,
	required($('main')),
)

//Initialize drag order
$$('.panel').map((panel, index) => panel.style.order = String(index))
