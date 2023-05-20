registerLayout("tabs", ({ tabBarSide = "top", textDirection = "right", children }) => {
	const el = document.createElement("div")
	const tabBarEl = el.appendChild(document.createElement("div"))
	// TODO: `onclick` handlers
	// TODO: use `tabBarSide` and `textDirection`
	for (const child of children) {
		const tabTitleEl = tabBarEl.appendChild(document.createElement("div"))
		if (child.icon) {
			const iconEl = tabTitleEl.appendChild(document.createElement("img"))
			iconEl.src = child.icon
		}
		if (child.name) {
			const nameEl = tabTitleEl.appendChild(document.createElement("div"))
			nameEl.innerText = child.name
		}
		render(el, child, false)
	}
	return el
})
