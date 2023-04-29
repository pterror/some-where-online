(() => {
	let isLoaded = false
	/** @type {() => void} */
	let resolveLoaded
	/** @type {Promise<void>} */
	const loaded = new Promise(resolve => { resolveLoaded = resolve })
	const aceEl = document.createElement("script")
	aceEl.src = "https://cdn.jsdelivr.net/npm/ace-builds@1.18.0/src-min-noconflict/ace.min.js"
	aceEl.onload = () => { resolveLoaded(); isLoaded = true }
	document.body.appendChild(aceEl)
	loadPanelType("ace", () => {
    // TODO: allow setting language
		/** @type {{ code: string }} */
		// @ts-expect-error
		const state = JSON.parse(localStorage.getItem("so_ace")) ?? { code: '' }
		const save = () => { localStorage.setItem("so_ace", JSON.stringify(state)) }
		const el = document.createElement("div")
		const init = () => {
			const editor = ace.edit(el)
      editor.setValue(state.code)
      editor.getSession().on("change", () => {
        state.code = editor.getValue()
        save()
      })
		}
		if (isLoaded) { init() } else { loaded.then(init) }
		return el
	})
})()
