(() => {
	const type = 't' in globalThis ? t.struct({ code: t.string }) : undefined
	const isType = type && typeValidator(type)
	/** @type {() => void} */
	let resolveLoaded
	/** @type {Promise<void>} */
	const loaded = new Promise(resolve => { resolveLoaded = resolve })
	const aceEl = document.createElement("script")
	aceEl.src = "https://cdn.jsdelivr.net/npm/ace-builds@1.18.0/src-min-noconflict/ace.min.js"
	aceEl.onload = () => { resolveLoaded() }
	document.body.appendChild(aceEl)
	registerPanel(
		"ace",
		/** @param {{ store?: string, key?: string }} [x] */
		({ store = "indexeddb", key = "global/ace" } = {}) => {
			const x = { store, key }
			// TODO: allow setting language
			const el = document.createElement("div")
			;(async () => {
				/** @type {(x_: typeof x) => Promise<TypeOf<typeof type>>} */
				const load = (x) => storeGet(x.store, x.key)
				/** @param {typeof x} x */
				const save = (x) => storeSet(x.store, x.key, state)
				let state = await load(x) ?? { code: "" }
				await loaded
				const editor = ace.edit(el, {
					theme: "ace/theme/dracula"
				})
				registerSwoDragDrop(el, loadIfValid(x, load, save, newState => {
					editor.setValue((state = newState).code)
				}, isType))
				editor.setValue(state.code)
				editor.getSession().on("change", () => {
					state.code = editor.getValue()
					save(x)
				})
			})()
			return el
		},
	)
})()
