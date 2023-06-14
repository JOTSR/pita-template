import * as Panels from '@panels'
import { render } from 'preact'
import { $, addPanelBuilder, required } from '@/frontend/src/utils.ts'
import { Button } from '@components'
import { PanelBuilder } from '@/frontend/panels/src/PanelBuilder.tsx'

const dialog = required($<HTMLDialogElement>('#panel-list-modal'))
required($('#panel-list-button')).addEventListener(
	'click',
	() => dialog.showModal(),
)

const style = /*css*/ `
    .pf90-box {
        overflow-y: scroll;
        display: grid;
        gap: 0.4rem;
        padding: 0.4rem;
    }

    .pf90-item {
        border: solid 0.2rem var(--bg-color-secondary);
        border-radius: 0.4rem;
        padding: 0.4rem;
        display: flex;
        gap: 0.4rem;
        justify-content: space-between;
        align-items: center;
    }

    .pf90-item span {
        padding: 0.4rem;
        user-select: none;
    }

    .pf90-menu {
        width: 100%;
        padding: 0 0.4rem 0.4rem 0.4rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.4rem;
    }

    .pf90-form {
        display: grid;
        gap: 0.4rem;
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
				<Button variant='secondary' data-value='cancel'>Annuler</Button>
				<Button variant='primary' data-value='add'>Ajouter</Button>
			</div>
		</form>
	</>,
	dialog,
)

function addPanels(event: Event) {
	const form = event.target as HTMLFormElement

	if ((event as SubmitEvent).submitter?.dataset.value === 'cancel') {
		event.preventDefault()
		form.reset()
		;(form.parentElement as HTMLDialogElement)?.close()
	}

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
