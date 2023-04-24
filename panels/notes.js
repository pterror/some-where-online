// wishlist: timestamps? sorting? markdown?
// - drag'n'drop to reorder
// - buttons to copy and delete
loadPanelType("notes", () => {
	/** @type {{ items: { html: string }[] }} */
	// @ts-expect-error
	const state = JSON.parse(localStorage.getItem("so_notes")) ?? { items: [] }
	const save = () => { localStorage.setItem("so_notes", JSON.stringify(state)) }
	const el = document.createElement("div")
	const headingEl = el.appendChild(document.createElement("h1"))
	headingEl.innerText = "notes"
	const listEl = el.appendChild(document.createElement("div"))
	for (const item of state.items) {
		const itemEl = listEl.appendChild(document.createElement("div"))
		itemEl.style.background = "var(--secondary-bg)"
		itemEl.style.margin = "0.5rem"
		itemEl.contentEditable = "true"
		itemEl.innerText = item.html
		itemEl.oninput = () => {
			item.html = itemEl.innerHTML
			save()
		}
	}
	const createEmptyItem = () => {
		const item = { html: "" }
		const itemEl = listEl.appendChild(document.createElement("div"))
		itemEl.style.background = "var(--secondary-bg)"
		itemEl.style.margin = "0.5rem"
		itemEl.contentEditable = "true"
		const normalOnChange = () => {
			item.html = itemEl.innerHTML
			save()
		}
		itemEl.oninput = () => {
			item.html = itemEl.innerHTML
			state.items.push(item)
			save()
			itemEl.onchange = normalOnChange
			createEmptyItem()
		}
	}
	createEmptyItem()
	// TODO: switch to empty element that becomes a regular list item + ???s on change
	return el
})
