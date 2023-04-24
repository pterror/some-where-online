type NoInfer<T> = [T][T extends T ? 0 : never]

interface Window {
	[key: string]: unknown
}

interface SerializedElement {
	0: string
	1?: Record<string, string>
	2?: (SerializedElement | string)[]
}

interface ScriptData {
	0: string
	1: () => void
}

interface Layout {
	title: string
	children: (SerializedElement | string)[]
}

// FIXME: better interface
// web components?
interface Plugin_<State> {
	name: string
	scripts?: (ScriptData | string)[]
	styles?: string[]
	shape?: { [K in keyof State]: Type<State[K]> }
	elements?: Record<string, (state: State, attributes: Record<string, string>, templates: readonly (string | SerializedElement)[]) => Element[]>
	/** Returns a function to free any handlers. */
	load: () => NoInfer<State>
	unload?: (state: NoInfer<State>) => void
}

declare const TYPE: unique symbol
type Type<T> = {
	[TYPE]: T
}

interface T {
	void: Type<void>
	undefined: Type<undefined>
	string: Type<string>
	number: Type<number>
	integer: Type<number>
	bigint: Type<bigint>
	symbol: Type<symbol>
	anyArray: Type<unknown[]>
	anyObject: Type<object>
	optional: <T>(item: Type<T>) => Type<T | undefined>
	tuple: <Ts extends [] | readonly Type<unknown>[]>(item: Ts) => Type<{ [K in keyof Ts]: Ts[K][typeof TYPE] }>
	struct: <Ts extends Record<K, Type<unknown>>, K extends keyof Ts = keyof Ts>(item: Ts) => Type<{ [K in keyof Ts]: Ts[K][typeof TYPE] }>
	array: <T>(item: Type<T>) => Type<T[]>
	dictionary: <K, V>(key: Type<K>, value: Type<V>) => Type<Record<K, V>>
}
