import project from '@pita/project.json' assert { type: 'json' }
import { $, required } from '@utils'
import { Project } from 'pita_api'
export const redpitaya = await Project.init(project)

redpitaya.addEventListener('disconnect', () => {
	required($('#connection-status')).innerHTML =
		'<i class="ri-link-unlink-m"></i>'
	required($('#connection-status')).classList.add('connect-status-alert')
})

redpitaya.addEventListener('error', (event) => {
	console.error('Websocket error: ', event)
})
