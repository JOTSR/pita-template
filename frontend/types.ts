export type MessageData<
	T extends 'signals' | 'parameters' | undefined = undefined,
> = T extends 'signals' ? Signals
	: T extends 'parameters' ? Parameters
	: Signals | Parameters
export type Signals = { signals: Record<MessageId, SignalDatas> }
export type SignalDatas = { size: number; value: number[] }
export type Parameters = { parameters: Record<MessageId, ParameterDatas> }
export type ParameterDatas = { value: number | boolean }

export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {
	length: TLength
}

export type MessageId = PinId | ChannelId | CustomId

export enum IOMode {
	RO,
	RW,
	WO,
}

export enum IOType {
	Digital,
	Analog,
}

export type Bitness<T extends 12n | 16n> = T extends 12n
	? 1n | 2n | 3n | 4n | 5n | 6n | 7n | 8n | 9n | 10n | 12
	: 
		| 1n
		| 2n
		| 3n
		| 4n
		| 5n
		| 6n
		| 7n
		| 8n
		| 9n
		| 10n
		| 12n
		| 13n
		| 14n
		| 15n
		| 16n

export enum Frequency {
	SMP_125M,
	SMP_62_500M,
	SMP_31_250M,
	SMP_15_625M,
	SMP_7_812M,
	SMP_3_906M,
	SMP_1_953M,
	SMP_976_562K,
	SMP_448_281K,
	SMP_244_140K,
	SMP_122_070K,
	SMP_61_035K,
	SMP_30_517K,
	SMP_15_258K,
	SMP_7_629K,
	SMP_3_814K,
	SMP_1_907K,
}

export enum Trigger {
	Disabled,
	Now,
	Ch1PositiveEdge,
	Ch2PositiveEdge,
	Ch1NegativeEdge,
	Ch2NegativeEdge,
	ExtPositiveEdge,
	ExtNegativeEdge,
	AWGPositiveEdge,
	AWGNegativeEdge,
}

export const Pin = {
	digital: {
		led0: 'digital_led_0',
		led1: 'digital_led_1',
		led2: 'digital_led_2',
		led3: 'digital_led_3',
		led4: 'digital_led_4',
		led5: 'digital_led_5',
		led6: 'digital_led_6',
		led7: 'digital_led_7',
		io0p: 'digital_io_0_p',
		io1p: 'digital_io_1_p',
		io2p: 'digital_io_2_p',
		io3p: 'digital_io_3_p',
		io4p: 'digital_io_4_p',
		io5p: 'digital_io_5_p',
		io6p: 'digital_io_6_p',
		io7p: 'digital_io_7_p',
		io1n: 'digital_io_1_n',
		io2n: 'digital_io_2_n',
		io3n: 'digital_io_3_n',
		io4n: 'digital_io_4_n',
		io5n: 'digital_io_5_n',
		io6n: 'digital_io_6_n',
		io7n: 'digital_io_7_n',
	},
	analog: {
		out0: 'analog_out_0',
		out1: 'analog_out_1',
		out2: 'analog_out_2',
		out3: 'analog_out_3',
		in0: 'analog_in_0',
		in1: 'analog_in_1',
		in2: 'analog_in_2',
		in3: 'analog_in_3',
	},
} as const

export type PinId =
	| typeof Pin.digital[keyof typeof Pin.digital]
	| typeof Pin.analog[keyof typeof Pin.analog]

export const ChannelPin = {
	adc1: 'channel_adc_1',
	adc2: 'channel_adc_2',
	dac1: 'channel_dac_1',
	dac2: 'channel_dac_2',
} as const

export type ChannelId = typeof ChannelPin[keyof typeof ChannelPin]

export type CustomId = `custom_${string}`

export type RPConnection<T extends 'signals' | 'parameters'> = {
	read: () => Promise<T extends 'signals' ? SignalDatas : ParameterDatas>
	write: (
		datas: T extends 'signals' ? SignalDatas : ParameterDatas,
	) => Promise<void>
	readIter: AsyncGenerator<
		T extends 'signals' ? SignalDatas : ParameterDatas,
		void,
		unknown
	>
	writeIter: AsyncGenerator<
		void,
		void,
		T extends 'signals' ? SignalDatas : ParameterDatas
	>
}

export type JsonValue = boolean | number | string | null | JsonValue[] | {
	[key: string]: JsonValue
}
