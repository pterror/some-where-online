// wishlist:
// show errors - either in hooked console, toast, or other modal
// wysiwyg layout editor
// plugins:
// quotes, random generation, cyberchef, photopea, excalidraw
// live html editor, image, video playback, audio playback, slideshow
// markdown editor via micromark
// json editor
// node editor using rete or https://github.com/wbkd/awesome-node-based-uis#javascript-libraries
// wysiwyg note editor with link support
// dwitter viewer, shadertoy viewer
// various playgrounds
// check out https://apps.sandstorm.io/ for more apps
// quill: https://quilljs.com/
// computeengine
// a way to prototype programs
// fs drag-n-drop via file system access api

if (false) {
	navigator.serviceWorker.register("serviceWorker.js")
}

const SWO = {
	/** @type {Record<string, any>} */
	PLUGIN_STATES: {},
	/** @type {Record<string, Store>} */
	STORES: {},
	/** @type {Record<keyof Layouts, CreateLayout<any>>} */
	// @ts-expect-error
	LAYOUT_CONSTRUCTORS: {},
	/** @type {Record<keyof Apps, CreateApp<any>>} */
	// @ts-expect-error
	APP_CONSTRUCTORS: {},
}

/** @param {Element} container */
function renderConfig(container) {
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
	settingsButtonEl.innerText = "⚙️" // TODO: switch to svg
}

/** @param {Element} container @param {AnyLayout} item @param {boolean} isTopLevel */
function render(container, item, isTopLevel = true) {
	const ctor = SWO.LAYOUT_CONSTRUCTORS[item.type]
	if (!ctor) {
		console.error("Unknown layout type: " + item.type)
		return document.createElement("div")
	}
	const el = container.appendChild(ctor(item))
	if (isTopLevel) {
		renderConfig(container)
	}
	return el
}

/** @template {keyof Layouts} Type @param {Type} name @param {CreateLayout<Type>} layout */
function registerLayout(name, layout) {
	SWO.LAYOUT_CONSTRUCTORS[name] = layout
}

/** @template {keyof Apps} Type @param {Type} name @param {CreateApp<Type>} createPanel */
function registerPanel(name, createPanel) {
	SWO.APP_CONSTRUCTORS[name] = createPanel
}

/** @param {string} name @param {Store} store */
function registerStore(name, store) {
	SWO.STORES[name] = store
}

/** @template T @return {Promise<T>} @param {string} store @param {string} key */
function storeGet(store, key) {
	return (/** @type {Store} */ (SWO.STORES[store])).get(key)
}

/** @template T @return {Promise<void>} @param {string} store @param {string} key @param {T} value */
function storeSet(store, key, value) {
	return (/** @type {Store} */ (SWO.STORES[store])).set(key, value)
}

/** @return {Promise<void>} @param {string} store @param {string} key */
function storeDelete(store, key) {
	return (/** @type {Store} */ (SWO.STORES[store])).delete(key)
}

/** @return {Promise<string[]>} @param {string} store */
function storeList(store) {
	return (/** @type {Store} */ (SWO.STORES[store])).list()
}

/** @param {DragEvent} event */
function _handleSwoDrag(event) {
	if (
		event.dataTransfer?.items.length !== 1 || event.dataTransfer.items[0]?.kind !== "string" ||
		event.dataTransfer.items[0].type !== "application/json+swo-locator"
	) {
		return
	}
	event.preventDefault()
}

const storeKeyType = 't' in globalThis ? t.struct({ store: t.string, key: t.string }) : undefined
/** @typedef {TypeOf<typeof storeKeyType>} StoreKey */

/** @param {HTMLElement} el @param {(value: StoreKey) => void} callback */
function registerSwoDragDrop(el, callback) {
	el.addEventListener("dragenter", _handleSwoDrag)
	el.addEventListener("dragover", _handleSwoDrag)
	el.addEventListener("dragleave", event => {
		if (
			event.dataTransfer?.items.length !== 1 || event.dataTransfer.items[0]?.kind !== "string" ||
			event.dataTransfer.items[0].type !== "application/json+swo-locator"
		) { return }
		event.dataTransfer.items[0].getAsString(s => {
			const data = JSON.parse(s)
			if (storeKeyType === undefined) {
				callback(data)
			} else if (isType(storeKeyType, data)) { // separate for extra type safety
				callback(data)
			}
		})
	})
}

const constTrue = () => true

/**
 * @template {StoreKey} X @template [T=unknown]
 * @param {X} x @param {(x: X) => Promise<unknown>} load @param {(x: X) => Promise<unknown>} save
 * @param {(x: T) => void} callback @param {((x: unknown) => x is T) | undefined} validate
 */
function loadIfValid(x, load, save, callback, validate) {
	const validate_ = validate ?? constTrue // fallback to `constTrue` is unsafe.
	/** @param {StoreKey} data */
	return async data => {
		Object.setPrototypeOf(data, x)
		// @ts-expect-error
		const ret = await load(data)
		if (validate_(ret)) {
			Object.assign(x, data)
			callback(ret)
			save(x)
		}
	}
}
