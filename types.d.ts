// interface Window {
// 	[key: string]: unknown
// }

type Axis = "horizontal" | "vertical"
type Side = "top" | "bottom" | "left" | "right"
type Direction = "up" | "down" | "left" | "right"

interface Layouts {
}
type AnyLayout = Layouts[keyof Layouts]
type Layout<Type extends keyof Layouts> = Layouts[Type]
type CreateLayout<Type extends keyof Layouts> = (options: Layout<Type>) => HTMLElement

interface Panels {
}
type AnyPanel = Panels[keyof Panels]
type Panel<Type extends keyof Panels> = Panels[Type]
// TODO: make this consistent with `CreateLayout`
type CreatePanel<Type extends keyof Panels> = (options?: Panel<Type>["options"]) => HTMLElement

interface Store {
	get: <T>(key: string) => Promise<T>
	set: <T>(key: string, value: T) => Promise<void>
	delete: (key: string) => Promise<void>
	list: () => Promise<string[]>
}
