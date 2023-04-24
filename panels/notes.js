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
	const actionsEl = document.createElement("div")
	actionsEl.style.float = "right"
	const deleteEl = actionsEl.appendChild(document.createElement("div"))
	deleteEl.style.cursor = "pointer"
	deleteEl.innerText = "🗑️"
	const listEl = el.appendChild(document.createElement("div"))
	/** @param {{ html: string }} item */
	const render = (item) => {
		const itemEl = listEl.appendChild(document.createElement("div"))
		Object.assign(itemEl.style, {
			background: "var(--secondary-bg)", margin: "0.5rem", display: "flex"
		})
		const contentEl = itemEl.appendChild(document.createElement("div"))
		contentEl.style.flex = "1 0 auto"
		contentEl.contentEditable = "true"
		contentEl.innerHTML = item.html
		contentEl.oninput = () => {
			item.html = contentEl.innerHTML
			save()
		}
		itemEl.onmouseenter = () => {
			itemEl.appendChild(actionsEl)
			deleteEl.onclick = () => {
				state.items.splice(state.items.indexOf(item), 1)
				save()
				itemEl.remove()
				if (listEl.children.length === 0) {
					createEmptyItem()
				}
			}
		}
		itemEl.onmouseleave = () => {
			itemEl.removeChild(actionsEl)
		}
		return { itemEl, contentEl }
	}
	for (const item of state.items) {
		render(item)
	}
	const createEmptyItem = () => {
		const item = { html: "" }
		const { contentEl } = render(item)
		const normalOnInput = contentEl.oninput
		contentEl.oninput = () => {
			item.html = contentEl.innerHTML
			state.items.push(item)
			save()
			contentEl.oninput = normalOnInput
			createEmptyItem()
		}
	}
	createEmptyItem()
	// TODO: switch to empty element that becomes a regular list item + ???s on change
	return el
})
