(() => {
	let isLoaded = false
	/** @type {() => void} */
	let resolveLoaded
	/** @type {Promise<void>} */
	const loaded = new Promise(resolve => { resolveLoaded = resolve })
	const tinymceEl = document.createElement("script")
	tinymceEl.src = "https://cdn.jsdelivr.net/npm/tinymce@6.4.1/tinymce.min.js"
	tinymceEl.onload = () => { resolveLoaded(); isLoaded = true }
	document.body.appendChild(tinymceEl)
	loadPanelType("tinymce", () => {
		/** @type {{ html: string }} */
		// @ts-expect-error
		const state = JSON.parse(localStorage.getItem("so_tinymce")) ?? { html: '' }
		const save = () => { localStorage.setItem("so_tinymce", JSON.stringify(state)) }
		const el = document.createElement("div")
		const editorEl = el.appendChild(document.createElement("div"))
		editorEl.style.height = "100%"
		const init = () => {
			tinymce.init({
				target: editorEl,
				base_url: "https://cdn.jsdelivr.net/npm/tinymce@6.4.1/",
				/** @param {any} editor */
				init_instance_callback: editor => {
					editor.setContent(state.html)
					const saveIfDirty = () => {
						if (editor.isDirty()) {
							state.html = editor.getBody().innerHTML
							save()
						}
					}
					editor.on("change", saveIfDirty)
					window.addEventListener("beforeunload", saveIfDirty)
				},
			})
		}
		if (isLoaded) { init() } else { loaded.then(init) }
		return el
	})
})()
