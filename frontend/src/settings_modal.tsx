import { Button } from '@/frontend/components/src/Button.tsx'
import { $, required } from '@/frontend/src/utils.ts'
import info from '@/www/info/info.json' assert { type: 'json' }
import project from '@pita/project.json' assert { type: 'json' }
import { render } from 'preact'

const dialog = required($<HTMLDialogElement>('#settings-modal'))

$('#settings-button')?.addEventListener('click', () => dialog.showModal())

const style = /*css*/ `
    .d0r-table {
        border: solid var(--border-width) var(--bg-color-secondary);
        border-radius: var(--border-radius);
        border-spacing: 0;
        width: 100%;
    }

    .d0r-table,
    .d0r-table tr {
        padding: 0;
    }

    .d0r-table th {
        background-color: var(--bg-color-secondary);
    }

    .d0r-table th,
    .d0r-table td {
        padding: 0.4rem;
        border: solid calc(var(--border-width) / 2) var(--bg-color-secondary);
    }

    .d0r-table tbody th {
        border-color: var(--bg-color);
    }

    .d0r-form {
        width: 100%;
        display: grid;
		padding: 0.4rem;
    }

    .d0r-div {
        padding: 0.4rem;
        display: grid;
        gap: 0.4rem;
    }
`

render(
	<>
		<style>{style}</style>
		<span className='dialog-title'>Settings</span>
		<div className='d0r-div'>
			<table className='d0r-table'>
				<thead>
					<tr>
						<th colSpan={2}>Project</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(project).map(([key, value]) => (
						<tr>
							<th>{key}</th>
							<td>{value}</td>
						</tr>
					))}
				</tbody>
			</table>
			<table className='d0r-table'>
				<thead>
					<tr>
						<th colSpan={2}>Info</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(info).map(([key, value]) => (
						<tr>
							<th>{key}</th>
							<td>{value}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
		<form method='dialog' className='d0r-form'>
			<Button variant='primary'>Fermer</Button>
		</form>
	</>,
	dialog,
)
