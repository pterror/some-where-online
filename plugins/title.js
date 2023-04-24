loadPlugin({
	name: 'title',
	load() {},
	elements: {
		title(_, __, { 0: title }) {
			if (typeof title !== "string") { console.error("so-plugin-title: title should be a string:", title); return [] }
			document.title = title
			return []
		},
	},
})
