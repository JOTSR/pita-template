import { Button, Panel } from '@components'
import { IO, IOMode, IOType } from 'pita_api'
import { useEffect, useState } from 'preact/hooks'

export function DataLogger(
	{ title, pin }: {
		title: string
		pin: IO<IOMode.RO, IOType.Analog>
	},
) {
	const initialTrace = {
		x: [] as number[],
		y: [] as number[],
		type: 'scatter',
	}

	const [id] = useState(crypto.randomUUID())
	const [state, setState] = useState(false)
	const [it, setIt] = useState(0)
	const [trace, setTrace] = useState(initialTrace)

	async function update() {
		trace.x.push((trace.x.at(-1) ?? 0) + 1)
		trace.y.push(await pin.read())
		setTrace(trace)
		//@ts-ignore e
		Plotly.newPlot(id, [trace], layout)
	}

	function save() {
		const link = document.createElement('a')
		const matrix = trace.x.map((
			_,
			index,
		) => [trace.x[index], trace.y[index]])
		link.href = `data:application/json,${
			encodeURIComponent(JSON.stringify(matrix))
		},`
		link.download = 'trace.json'
		link.target = '_blank'
		link.click()
	}

	const layout = {
		autosize: true,
		margin: { l: 20, r: 20, t: 20, b: 20 },
		plot_bgcolor: 'rgba(0, 0, 0, 0)',
		paper_bgcolor: 'rgba(0, 0, 0, 0)',
	}
	useEffect(() => {
		//@ts-ignore e
		Plotly.newPlot(id, [trace], layout)
	}, [])

	useEffect(() => {
		clearInterval(it)
		pin.setActive(state).then(() => {
			if (state) setIt(setInterval(update, 100))
		})
	}, [state])

	return (
		<Panel title={title} size={[4, 3]}>
			<div
				id={id}
				style={{ height: '24rem', backdropFilter: 'blur(0.4rem)' }}
			>
			</div>
			<div
				style={{
					width: '100%',
					display: 'grid',
					gap: '0.4rem',
					gridTemplateColumns: 'repeat(3, 1fr)',
				}}
			>
				<Button
					variant='primary'
					onClick={() => setState(!state)}
				>
					{state ? 'Stop' : 'Acquire'}
				</Button>
				<Button
					variant='alert'
					onClick={() => {
						if (confirm('Clear datas ?')) {
							setTrace(initialTrace)
						}
					}}
				>
					Clear
				</Button>
				<Button variant='secondary' onClick={save}>Save trace</Button>
			</div>
		</Panel>
	)
}
