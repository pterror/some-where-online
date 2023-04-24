interface Window {
	[key: string]: unknown
}

type CreatePanel = (options?: unknown) => HTMLElement
type PanelData = { type: "panel", size?: string, name: string, options?: unknown }
type PanelsData = { type: "panels", direction: "horizontal" | "vertical", size?: string, children: PanelsItemData[] }
type PanelsItemData = PanelData | PanelsData

// FIXME: better interface
// web components?
