// wishlist:
// show errors - either in hooked console, toast, or other modal
// wysiwyg layout editor
// finish plugins...

// TODO: figure out how to create multiple instances of one plugin?
// e.g. each component creates its own instance

/** @type {Record<string, any>} */
const PLUGIN_STATES = {}
/** @type {Record<string, CreatePanel>} */
const PANEL_CONSTRUCTORS = {}

/**
 * @param {Element} container
 * @param {PanelsItemData} item */
function render(container, item) {
	let el
	switch (item.type) {
		case "panel": {
			const ctor = PANEL_CONSTRUCTORS[item.name]
			if (!ctor) { console.error(`unknown panel type '${item.type}'`); return }
			el = container.appendChild(ctor(item.options))
			break
		}
		case "panels": {
			el = container.appendChild(document.createElement("div"))
			Object.assign(el.style, { display: "flex", flexFlow: item.direction === "horizontal" ? "row nowrap" : "column nowrap" })
			for (const child of item.children) { render(el, child) }
			break
		}
	}
	el.style.flex = /^\d*\.\d*fr/.test(item.size) ? `${item.size.slice(0, -2)} 0 0` : `0 0 ${item.size}`
	return el
}


/** @param {string} name @param {CreatePanel} createPanel */
function loadPanelType(name, createPanel) {
	PANEL_CONSTRUCTORS[name] = createPanel
}
