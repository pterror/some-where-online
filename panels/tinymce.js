(() => {
	const type = 't' in globalThis ? t.struct({ html: t.string }) : undefined
	const isType = type && typeValidator(type)
	/** @type {() => void} */
	let resolveLoaded
	/** @type {Promise<void>} */
	const loaded = new Promise(resolve => { resolveLoaded = resolve })
	const tinymceEl = document.createElement("script")
	tinymceEl.src = "https://cdn.jsdelivr.net/npm/tinymce@6.4.1/tinymce.min.js"
	tinymceEl.onload = () => { resolveLoaded() }
	document.body.appendChild(tinymceEl)
	registerPanel(
		"tinymce",
		/** @param {{ store?: string, key?: string }} [x] */
		({ store = "indexeddb", key = "global/tinymce" } = {}) => {
			const x = { store, key }
			const el = document.createElement("div")
			const editorEl = el.appendChild(document.createElement("div"))
			;(async () => {
				/** @type {(x_: typeof x) => Promise<TypeOf<typeof type>>} */
				const load = (x) => storeGet(x.store, x.key)
				/** @param {typeof x} x */
				const save = (x) => storeSet(x.store, x.key, state)
				let state = await load(x) ?? { html: "" }
				editorEl.style.height = "100%"
				await loaded
				tinymce.init({
					target: editorEl,
					base_url: "https://cdn.jsdelivr.net/npm/tinymce@6.4.1/",
					skin: "oxide-dark",
					/** @param {any} editor */
					init_instance_callback: editor => {
						registerSwoDragDrop(el, loadIfValid(x, load, save, newState => {
							state = newState
							editor.setContent(state.html)
						}, isType))
						editor.setContent(state.html)
						const saveIfDirty = () => {
							if (editor.isDirty()) {
								state.html = editor.getBody().innerHTML
								save(x)
							}
						}
						editor.on("change", saveIfDirty)
						window.addEventListener("beforeunload", saveIfDirty)
					},
				})
			})();
			return el
		},
	)
})()
