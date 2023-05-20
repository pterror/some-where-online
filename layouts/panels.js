registerLayout("panels", item => {
	const el = document.createElement("div")
	Object.assign(el.style, {
		display: "flex", flexFlow: item.direction === "horizontal" ? "row nowrap" : "column nowrap",
	})
	for (const child of item.children) { render(el, child, false) }
	return el
})
