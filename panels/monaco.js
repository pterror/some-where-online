(() => {
	let isLoaded = false
	/** @type {() => void} */
	let resolveLoaded
	/** @type {Promise<void>} */
	const loaded = new Promise(resolve => { resolveLoaded = resolve })
	const monacoEl = document.createElement("script")
	monacoEl.src = "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.1/min/vs/loader.js"
	monacoEl.onload = () => {
		require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.1/min/vs" } });
		require(["vs/editor/editor.main"], () => {
			resolveLoaded()
		})
		isLoaded = true
	}
	document.body.appendChild(monacoEl)
	loadPanelType("monaco", () => {
		// TODO: allow setting language
		/** @type {{ code: string }} */
		// @ts-expect-error
		const state = JSON.parse(localStorage.getItem("so_monaco")) ?? { code: '' }
		const save = () => { localStorage.setItem("so_monaco", JSON.stringify(state)) }
		const el = document.createElement("div")
		const init = () => {
			const editor = monaco.editor.create(el, {
				value: state.code, automaticLayout: true,
			})
			editor.onDidChangeModelContent(() => {
				state.code = editor.getValue()
				save()
			})
		}
		if (isLoaded) { init() } else { loaded.then(init) }
		return el
	})
})()
