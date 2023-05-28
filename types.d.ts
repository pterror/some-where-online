type Axis = "horizontal" | "vertical"
type Side = "top" | "bottom" | "left" | "right"
type Direction = "up" | "down" | "left" | "right"

interface Layouts {
}
type AnyLayout = Layouts[keyof Layouts]
type Layout<Type extends keyof Layouts> = Layouts[Type]
type CreateLayout<Type extends keyof Layouts> = (options: Layout<Type>) => HTMLElement

interface Apps {
}
type AnyApp = Apps[keyof Apps]
type App<Type extends keyof Apps> = Apps[Type]
// TODO: make this consistent with `CreateLayout`
type CreateApp<Type extends keyof Apps> = (options?: App<Type>["options"]) => HTMLElement

interface Store {
	get: <T>(key: string) => Promise<T>
	set: <T>(key: string, value: T) => Promise<void>
	delete: (key: string) => Promise<void>
	list: () => Promise<string[]>
}
