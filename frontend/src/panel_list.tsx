import * as Panels from '@panels'
import { render } from 'preact'
import { $, addPanelBuilder, required } from '@/frontend/src/utils.ts'
import { Button } from '@components'
import { PanelBuilder } from '../panels/src/PanelBuilder.tsx'

const dialog = required($<HTMLDialogElement>('#panel-list-modal'))
required($('#panel-list-button')).addEventListener(
	'click',
	() => dialog.showModal(),
)

const style = /*css*/ `
    .pf90-box {
        overflow-y: scroll;
        display: grid;
        gap: 0.2rem;
        padding: 0.2rem;
    }

    .pf90-item {
        border: solid 0.2rem #ecdaaf;
        border-radius: 0.4rem;
        padding: 0.2rem;
        display: flex;
        gap: 0.2rem;
        justify-content: space-between;
        align-items: center;
    }

    .pf90-item span {
        padding: 0.2rem;
        user-select: none;
    }

    .pf90-menu {
        width: 100%;
        padding: 0.2rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.2rem;
    }

    .pf90-form {
        display: grid;
        gap: 0.2rem;
        width: 100%;
        max-height: 70%;
    }
`

render(
	<>
		<style>{style}</style>
		<span className='dialog-title'>Panels</span>
		<form method='dialog' className='pf90-form' onSubmit={addPanels}>
			<div className='pf90-box'>
				{Object.entries(Panels).map(([name]) => (
					<label className='pf90-item'>
						<span>{name}</span>
						<input type='checkbox' name={name} />
					</label>
				))}
			</div>
			<div className='pf90-menu'>
				<Button variant='secondary'>Annuler</Button>
				<Button variant='primary'>Ajouter</Button>
			</div>
		</form>
	</>,
	dialog,
)

function addPanels(event: Event) {
	const form = event.target as HTMLFormElement
	const formData = new FormData(form)
	for (
		const panelName of formData.keys() as IterableIterator<
			keyof typeof Panels
		>
	) {
		addPanelBuilder(
			<PanelBuilder panelName={panelName} />,
		)
	}
	form.reset()
}
