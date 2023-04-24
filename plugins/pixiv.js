loadPlugin({
	name: 'pixiv',
	load() {
		const json = localStorage.getItem('so_pixiv')
		return json ? JSON.parse(json) : {}
	},
	elements: {
		pixiv({}) {
			const el = document.createElement("div")
			return [el]
		},
	},
})
