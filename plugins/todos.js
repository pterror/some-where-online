loadPlugin({
	name: 'todos',
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
		notes({ notes }, _2, { 0: todoTemplate }) {
			if (!todoTemplate) { console.error("so_plugin_todos: no template"); return [] }
			const el = document.createElement("div")
			for (const note of notes) {
				const noteEl = el.appendChild(document.createElement("div"))
				render(noteEl, [todoTemplate], { note })
			}
			render(el, [["div", {
				onclick: "", // TODO: somehow mutate notes
			}, ["+"]]])
			return [el]
		},
	},
})
