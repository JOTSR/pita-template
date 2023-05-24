export function NumericDisplay(
	{ value, unit, precision }: {
		value: number
		unit: string
		precision: number
	},
) {
	return (
		<div className='numeric_display'>
			<span className='numeric_display-value'>
				{value.toPrecision(precision)}
			</span>
			<span className='numeric_display-unit'>{unit}</span>
		</div>
	)
}
