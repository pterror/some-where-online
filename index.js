// wishlist:
// show errors - either in hooked console, toast, or other modal
// wysiwyg layout editor
// finish plugins...
// backends:
// google drive, onedrive, mega
// s3, b2, r2
// quotes
// random generation
// cyberchef
// ace editor
// photopea
// excalidraw
// TODO: service workers

// TODO: figure out how to create multiple instances of one plugin?
// e.g. each component creates its own instance

/** @type {Promise<IDBInterface>} */
const db = new Promise((ret, err) => {
	const open = indexedDB.open("somewhereonline", 1)
	open.onerror = err
	open.onsuccess = () => ret({
		get: (key) => {
			return new Promise((ret, err) => {
				const req = open.result.transaction("").objectStore("").get(key)
				req.onerror = err
				req.onsuccess = () => ret(req.result)
			})
		},
		set: (key, value) => {
			return new Promise((ret, err) => {
				const req = open.result.transaction("").objectStore("").put(value, key)
				req.onerror = err
				req.onsuccess = () => ret()
			})
		},
	})
	open.onupgradeneeded = () => {
		const db = open.result
		db.createObjectStore("")
	}
})


/** @type {Record<string, any>} */
const PLUGIN_STATES = {}
/** @type {Record<string, CreatePanel>} */
const PANEL_CONSTRUCTORS = {}

/**
 * @param {Element} container
 * @param {PanelsItemData} item
 * @param {boolean} isTopLevel */
function render(container, item, isTopLevel = true) {
	let el
	switch (item.type) {
		case "panel": {
			const ctor = PANEL_CONSTRUCTORS[item.name]
			if (!ctor) { console.error(`unknown panel type '${item.name}'`); return }
			el = container.appendChild(ctor(item.options))
			break
		}
		case "panels": {
			el = container.appendChild(document.createElement("div"))
			Object.assign(el.style, {
				display: "flex", flexFlow: item.direction === "horizontal" ? "row nowrap" : "column nowrap",
			})
			for (const child of item.children) { render(el, child, false) }
			break
		}
	}
	const size = item.size ?? "1fr"
	el.style.flex = /^\d+(\.\d*)?fr/.test(size) ? `${size.slice(0, -2)} 0 0` : `0 0 ${item.size}`
	if (isTopLevel) {
		const configContainerEl = container.appendChild(document.createElement("div"))
		Object.assign(configContainerEl.style, {
			fontSize: "2rem", background: "var(--primary-bg)", position: "absolute", bottom: "0", right: "0",
		})
		const settingsModalContainerEl = document.createElement("div")
		Object.assign(settingsModalContainerEl.style, {
			display: "grid", placeItems: "center", position: "fixed",
			top: "0", left: "0", height: "100vh", width: "100vw",
			background: "rgba(var(--primary-bg-rgb), 0.75)",
		})
		settingsModalContainerEl.onclick = (e) => {
			if (e.target === e.currentTarget) {
				settingsModalContainerEl.remove()
			}
		}
		const settingsModalEl = settingsModalContainerEl.appendChild(document.createElement("div"))
		settingsModalEl.style.background = "var(--secondary-bg)"
		const settingsButtonEl = configContainerEl.appendChild(document.createElement("div"))
		settingsButtonEl.style.padding = "0.25em"
		settingsButtonEl.onclick = () => {
			container.appendChild(settingsModalContainerEl)
		}
		settingsButtonEl.onmouseenter = () => {
			settingsButtonEl.style.background = "var(--secondary-bg)"
		}
		settingsButtonEl.onmouseleave = () => {
			settingsButtonEl.style.background = ""
		}
		settingsButtonEl.style.cursor = "pointer"
		settingsButtonEl.innerText = "⚙️"
	}
	return el
}


/** @param {string} name @param {CreatePanel} createPanel */
function loadPanelType(name, createPanel) {
	PANEL_CONSTRUCTORS[name] = createPanel
}
