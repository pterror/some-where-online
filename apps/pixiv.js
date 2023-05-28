registerPanel("pixiv", () => {
	// session cookie
	// @ts-expect-error
	const state = JSON.parse(localStorage.getItem("so_pixiv"))
	const el = document.createElement("div")
	if (!state) {
		// render some way to log in
	}
	return el
})
