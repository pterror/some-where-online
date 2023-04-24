// wishlist: timestamps? sorting? markdown?
loadPlugin({
	name: 'notes',
	load() {
		// FIXME: localStorage should be explicitly used, not be the default
		const json = localStorage.getItem('so_notes')
		return json ? JSON.parse(json) : {
			notes: []
		}
	},
	shape: {
		notes: t.array(t.string),
	},
	elements: {
		// TODO: consider restructuring so changes can be propagated up
		notes({ notes }, _, { 0: noteTemplate }) {
			if (!noteTemplate) { console.error("so_plugin_notes: no template"); return [] }
			const el = document.createElement("div")
			for (let i = 0; i < notes.length; i++) {
				const noteEl = el.appendChild(document.createElement("div"))
				render(noteEl, [noteTemplate], { note: /** @type {string} */ (notes[i]) }, { setNote: event => { notes[i] = event.target?.innerText ?? ""; } })
			}
			// FIXME: let users define their own header and footer
			render(el, [["div", {
				onclick: "",
			}, ["+"]]])
			return [el]
		},
	},
})
