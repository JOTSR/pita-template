import { Button, Panel } from '@components'
import * as Panels from '@panels'
import { Builder } from '@types'
import { JSX, render } from 'preact'
import { useEffect, useState } from 'preact/hooks'

export function PanelBuilder(
	{ panelName }: { panelName: keyof typeof Panels },
) {
	const [fields, setFields] = useState<JSX.Element[]>([])
	//@ts-ignore bad inferrence
	const builder = Panels[panelName].__builder__ as Builder
	if (builder === undefined) {
		alert(`No builder implemented yet for ${panelName}`)
		throw new Error(`no builder implemented yet for ${panelName}`)
	}
	useEffect(() => {
		const fields: JSX.Element[] = []
		for (const fieldName in builder.props) {
			const fieldProps = builder.props[fieldName]

			if (fieldProps.type === 'select') {
				fields.push(
					<label>
						<span>{fieldName}</span>
						<select name={fieldName} required>
							{fieldProps.options.map((option) => (
								<option value={option}>{option}</option>
							))}
						</select>
					</label>,
				)

				continue
			}

			fields.push(
				<label>
					<span>{fieldName}</span>
					<input name={fieldName} type={fieldProps.type} required>
					</input>
				</label>,
			)
		}
		setFields(fields)

		if (!(panelName in Panels)) {
			throw new TypeError(
				`can't add panel template for unknown panel ${panelName}`,
			)
		}
	}, [])

	return (
		<Panel title={panelName} size={[2, 2]}>
			<form
				onSubmit={(e) => renderPanel(e, builder)}
				className='panel_builder-form'
			>
				{...fields}
				<Button variant='primary'>
					Valider
				</Button>
			</form>
		</Panel>
	)
}

function renderPanel(event: Event, builder: Builder) {
	event.preventDefault()
	const form = event.target as HTMLFormElement
	const root = form.parentElement!.parentElement!
	const order = root.style.order!
	const formData = new FormData(form)

	//TODO add type assertions
	const props = Object.fromEntries([...formData.entries()]) as Record<
		string,
		unknown
	>
	//@ts-ignore TODO add type assertions
	const element = builder.render(props)

	render(
		element,
		root,
	)
	;(root.firstElementChild! as HTMLElement).style.order = order
	root.replaceWith(root.firstElementChild!)
}
