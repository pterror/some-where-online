declare const TYPE_BRAND: unique symbol
type Type<T> = {
	[TYPE_BRAND]: T
}
type TypeOf<T extends Type<unknown> | undefined> = NonNullable<T>[typeof TYPE_BRAND]

type Const<T> =
| (T extends infer U ? U : never)
| Extract<T, number | string | boolean | bigint | symbol | null | undefined | []>
| ([T] extends [[]] ? readonly [] : { readonly [K in keyof T]: Narrow<T[K]> })

interface T {
	void: Type<void>
	undefined: Type<undefined>
	string: Type<string>
	number: Type<number>
	integer: Type<number>
	boolean: Type<boolean>
	bigint: Type<bigint>
	symbol: Type<symbol>
	anyArray: Type<unknown[]>
	anyObject: Type<object>
	literal: <T>(value: Const<T>) => Type<T>
	optional: <T>(item: Type<T>) => Type<T | null | undefined>
	tuple: <Ts extends [] | readonly Type<unknown>[]>(item: Ts) => Type<{ [K in keyof Ts]: Ts[K][typeof TYPE_BRAND] }>
	struct: <Ts extends Record<K, Type<unknown>>, K extends keyof Ts = keyof Ts>(item: Ts) => Type<{ [K in keyof Ts]: Ts[K][typeof TYPE_BRAND] }>
	array: <T>(item: Type<T>) => Type<T[]>
	dictionary: <K, V>(key: Type<K>, value: Type<V>) => Type<Record<K, V>>
	anyOf: <T>(...members: Type<T>[]) => Type<T>
	allOf: <Ts extends [] | readonly Type<unknown>[]>(...members: Ts) => Type<FoldIntersection<{ [K in keyof Ts]: Ts[K][typeof TYPE_BRAND] }>>
}

type TRepr =
| { type: "void" }
| { type: "undefined" }
| { type: "string" }
| { type: "number" }
| { type: "integer" }
| { type: "boolean" }
| { type: "bigint" }
| { type: "symbol" }
| { type: "anyArray" }
| { type: "anyObject" }
| { type: "literal", value: unknown }
| { type: "optional", shape: Type<unknown> }
| { type: "tuple", shape: Type<unknown>[] }
| { type: "struct", shape: Record<PropertyKey, Type<unknown>> }
| { type: "array", item: Type<unknown> }
| { type: "dictionary", key: Type<unknown>, value: Type<unknown> }
| { type: "anyOf", members: Type<unknown>[] }
| { type: "allOf", members: Type<unknown>[] };
