// wishlist:
// show errors - either in hooked console, toast, or other modal
// wysiwyg layout editor
// finish plugins...

// notes:
// ["@plugin:element", , [templates]] isn't 100% flexible since the plugin still controls where the elements go

/** @type {Layout} */
const DEFAULT_LAYOUT = {
	title: "somewhere online",
	children: [
		["style", , [`
			:root {
				font-family: Quicksand;
				font-weight: 400;
				--primary: #000000;
				--primary-bg: #ffffff;
			}

			@media (prefers-color-scheme: dark) {
				:root {
					--primary: #ffffff;
					--primary-bg: #222222;
				}
			}

			body {
				color: var(--primary);
				background: var(--primary-bg);
				overflow-y: hidden;
			}
		`]],
		["link", { rel: "preconnnect", href: "https://fonts.googleapis.com" }],
		["link", { rel: "preconnnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
		["link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap" }],
		["div", {
			style: "position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; display: grid; place-items: center; text-align: center; font-size: min(16vw, 12vh); line-height: 2em; opacity: 1; transition: opacity 0.5s ease-in-out;"
		}, [
			"you are", ["br"], "somewhere", ["br"], "online", ["br"],
			["svg:svg", {
				width: "1.5em",
				height: "1.5em",
				viewBox: "0 0 32 32",
				fill: "none",
				stroke: "currentColor",
				"stroke-linejoin": "round",
				"stroke-width": "0.67",
				style: "cursor: pointer",
				onclick: "const div = event.currentTarget.parentElement; div.style.opacity = \"0\"; setTimeout(() => { div.remove(); document.body.style.overflowY = \"unset\"; }, 500);",
			}, [
				["svg:ellipse", { cx: "16", cy: "16", rx: "14", ry: "14" }],
				["svg:path", { d: "M11 9L11 22 23 16Z" }],
			]],
		]],
		/*["div", , [
			["@notes:notes", , [["div", { contenteditable: "" }, ["$note"]]]]
		]],
		["div", , [["ul", , [
			["@todos:todos", , [["li", , [["input", { type: "checkbox" }], ["div", { contenteditable: "" }, ["$todo"]]]]]]
		]]]],*/
		// TODO: shortcuts plugin i guess - but lazy load (and lazy unload) it
	],
}

// TODO: figure out how to instantiate plugins

/** @type {Record<string, string>} */
const NS_LOOKUP = {
	svg: 'http://www.w3.org/2000/svg'
}

/** @type {Record<string, any>} */
const PLUGIN_STATES = {}

const EMPTY_OBJECT = Object.freeze({})
/** @type {readonly never[]} */
const EMPTY_ARRAY = Object.freeze([])

/**
 * @param {Element} container
 * @param {(SerializedElement | string)[]} elementData
 * @param {Record<string, SerializedElement | string>} [variables] */
function render(container, elementData, variables = {}) {
	for (const elementDatum of elementData) {
		if (typeof elementDatum === "string") {
			container.appendChild(document.createTextNode(elementDatum))
		} else {
			const { 0: tagRaw, 1: attributes, 2: children } = elementDatum
			if (tagRaw.startsWith("$")) {
				const variable = variables[tagRaw.slice(1)]
				if (variable) { render(container, [variable], variables) }
				return
			}
			const { 1: isPlugin, 2: ns, 3: tag } = tagRaw.match(/^(@?)(?:(.*):)?(.+)$/) ?? [,'','','']
			if (isPlugin) {
				const plugin = PLUGINS[ns]
				if (!plugin) { console.error(`plugin '${ns}' not found`); return }
				const element = plugin.elements?.[tag]
				if (!element) { console.error(`plugin '${ns}' has no element '${tag}'`); return }
				element(PLUGIN_STATES[ns], attributes ?? EMPTY_OBJECT, children ?? EMPTY_ARRAY)
				return
			}
			const element = container.appendChild(document.createElementNS((ns && NS_LOOKUP[ns]) ?? 'http://www.w3.org/1999/xhtml', tag))
			if (attributes) {
				for (const { 0: name, 1: value } of Object.entries(attributes)) {
					element.setAttribute(name, value)
				}
			}
			if (children) { render(element, children) }
		}
	}
}

/** @param {Layout} layout */
function applyLayout(layout) {
	document.title = layout.title
	const bodyEl = document.createElement("body")
	render(bodyEl, layout.children)
	document.body.replaceWith(bodyEl)
}

/** @type {Record<string, Plugin_<any>>} */
const PLUGINS = {}

// TODO: try to remember what i wanted this for
const t = /** @type {T} */ (/** @type {Record<keyof T, unknown>} */ ({
	void: { type: 'void' },
	undefined: { type: 'undefined' },
	string: { type: 'string' },
	number: { type: 'number' },
	integer: { type: 'integer' },
	bigint: { type: 'bigint' },
	symbol: { type: 'symbol' },
	anyArray: { type: 'anyArray' },
	anyObject: { type: 'anyObject' },
	/** @param {unknown} shape */
	optional(shape) { return { type: 'optional', shape } },
	/** @param {unknown} shape */
	tuple(shape) { return { type: 'tuple', shape } },
	/** @param {unknown} shape */
	struct(shape) { return { type: 'struct', shape } },
	/** @param {unknown} item */
	array(item) { return { type: 'array', item } },
	/** @param {unknown} key @param {unknown} value */
	dictionary(key, value) { return { type: 'dictionary', key, value } },
}))

/** @template {Record<PropertyKey, unknown> | void} [State=void] @param {Plugin_<State>} plugin */
function loadPlugin(plugin) {
	for (const style of plugin.styles ?? []) {
		const styleEl = document.body.appendChild(document.createElement("link"))
		styleEl.rel = "stylesheet"
		styleEl.href = style
	}
	for (const script of plugin.scripts ?? []) {
		const scriptEl = document.body.appendChild(document.createElement("script"))
		scriptEl.src = typeof script === "string" ? script : script[0]
	}
	if (PLUGINS[plugin.name]) { console.error(`another plugin named '${plugin.name}' has already been loaded`) }
	PLUGINS[plugin.name] = plugin
	PLUGIN_STATES[plugin.name] = plugin.load()
}

/** @param {Plugin_<any>} plugin */
function unloadPlugin(plugin) {
	for (const style of plugin.styles ?? []) {
		const styleEl = document.querySelector(`link[rel=stylesheet][href=${style}]`)
		if (styleEl) { document.body.removeChild(styleEl) }
	}
	for (let script of plugin.scripts ?? []) {
		if (typeof script !== 'string') {
			let unload
			({ 0: script, 1: unload } = script)
			unload()
		}
		const scriptEl = document.querySelector(`script[src=${script}]`)
		if (scriptEl) { document.body.removeChild(scriptEl) }
	}
	delete PLUGINS[plugin.name]
	plugin.unload?.(PLUGIN_STATES[plugin.name])
	delete PLUGIN_STATES[plugin.name]
	// TODO: remove nodes associated with plugin
}

const layout = (() => {
	const json = localStorage.getItem("so_layout")
	return json ? JSON.parse(json) : DEFAULT_LAYOUT
})()

setTimeout(() => applyLayout(layout), 1)
