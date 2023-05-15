import { useRef } from 'preact/hooks'
import { ComponentChildren } from 'preact'
import { $$, globalState } from '@/frontend/src/utils.ts'

/**
 * Movable instrument pannel.
 * @param {string} title - Panel title.
 * @param {[number, number]} size - Panel size in grid cells.
 */
export function Panel(
	{ children, title, size }: {
		children: ComponentChildren
		title: string
		size: [number, number]
	},
) {
	const panel = useRef<HTMLDivElement>(null)

	function enableDrag(draggable: boolean) {
		return () =>
			$$('.panel').forEach((panel) =>
				panel.setAttribute('draggable', String(draggable))
			)
	}

	function handleDrag(event: DragEvent) {
		globalState.set('dragSource', panel.current)
		panel.current?.classList.toggle('panel_ondrag')
		if (event.dataTransfer === null) return
		event.dataTransfer.effectAllowed = 'move'
		panel.current?.classList.remove('panel_ondragover')
	}

	function handleDrop() {
		panel.current?.classList.remove('panel_ondragover')
		//Swap grid order
		const target = panel.current!
		const source = globalState.get('dragSource') as HTMLElement
		globalState.delete('dragSource')

		const [targetOrder, sourceOrder] = [
			target.style.order,
			source.style.order,
		]

		target.style.order = sourceOrder
		source.style.order = targetOrder
	}

	function handleOver() {
		panel.current?.classList.toggle('panel_ondragover')
	}

	return (
		<div
			className='panel'
			title={title}
			ref={panel}
			onDragStart={handleDrag}
			onDragEnd={handleDrag}
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
			onDragEnter={handleOver}
			onDragLeave={handleOver}
			style={`grid-column: span ${size[0]}; grid-row: span ${size[1]}`}
		>
			<div className='panel-header'>
				<span
					title='Remove panel'
					style='cursor: pointer;'
					onClick={() => panel.current?.remove()}
				>
					<i class='ri-close-circle-line'></i>
				</span>
				<span>{title}</span>
				<span
					title='Drag panel'
					style='cursor: move;'
					onMouseDown={enableDrag(true)}
					onMouseLeave={enableDrag(false)}
				>
					<i class='ri-draggable'></i>
				</span>
			</div>
			<div className='panel-content'>{children}</div>
		</div>
	)
}
