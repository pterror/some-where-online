// wishlist: timestamps? sorting? markdown?
loadPlugin({
	name: 'notes',
	load() {
		// FIXME: localStorage should be explicitly used, not the default
		const json = localStorage.getItem('so_notes')
		return json ? JSON.parse(json) : {
			notes: []
		}
	},
	shape: {
		notes: t.array(t.string),
	},
	elements: {
		notes({ notes }, _, { 0: noteTemplate }) {
			if (!noteTemplate) { console.error("so_plugin_notes: no template"); return [] }
			const el = document.createElement("div")
			for (const note of notes) {
				const noteEl = el.appendChild(document.createElement("div"))
				render(noteEl, [noteTemplate], { note })
			}
			render(el, [["div", {
				onclick: "", // TODO: somehow mutate notes
			}, ["+"]]])
			return [el]
		},
	},
	actions: {
		add({ notes }) {
			notes.push('') // IMPL
		},
	},
})
