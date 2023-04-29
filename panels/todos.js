loadPanelType("todos", () => {
	/** @type {{ items: { done: boolean, html: string }[] }} */
	// @ts-expect-error
	const state = JSON.parse(localStorage.getItem("so_todos")) ?? { items: [] }
	const save = () => { localStorage.setItem("so_todos", JSON.stringify(state)) }
	const el = document.createElement("div")
	const headingEl = el.appendChild(document.createElement("h1"))
	headingEl.innerText = "to do list"
	const actionsEl = document.createElement("div")
	actionsEl.style.float = "right"
	const deleteEl = actionsEl.appendChild(document.createElement("div"))
	deleteEl.style.cursor = "pointer"
	deleteEl.innerText = "🗑️"
	const listEl = el.appendChild(document.createElement("div"))
	/** @param {HTMLElement} el
	 * @param {boolean} checked */
	const style = (el, checked) => {
		Object.assign(el.style, checked ? {
			opacity: "50%", textDecoration: "line-through"
		} : {
			opacity: "", textDecoration: ""
		})
	}
	/** @param {{ done: boolean, html: string }} item */
	const render = (item) => {
		const itemEl = listEl.appendChild(document.createElement("div"))
		itemEl.style.display = "flex"
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
		const checkboxEl = itemEl.appendChild(document.createElement("input"))
		checkboxEl.style.margin = "0 0.5rem"
		checkboxEl.type = "checkbox"
		checkboxEl.checked = item.done
		checkboxEl.onchange = () => {
			item.done = checkboxEl.checked
			style(textEl, checkboxEl.checked)
			save()
		}
		const textEl = itemEl.appendChild(document.createElement("div"))
		textEl.style.flex = "1 0 auto"
		textEl.contentEditable = "true"
		textEl.innerHTML = item.html
		textEl.oninput = () => {
			item.html = textEl.innerHTML
			save()
		}
		style(textEl, checkboxEl.checked)
		return { itemEl, checkboxEl, textEl }
	}
	for (const item of state.items) {
		render(item)
	}
	const createEmptyItem = () => {
		const item = { done: false, html: "" }
		const { itemEl, checkboxEl, textEl } = render(item)
		const onMouseEnter = itemEl.onmouseenter
		itemEl.onmouseenter = null
		const onMouseLeave = itemEl.onmouseleave
		itemEl.onmouseleave = null
		checkboxEl.disabled = true
		textEl.style.borderBottom = "1px solid"
		const normalOnInput = textEl.oninput
		const saveAndCreateNew = () => {
			checkboxEl.disabled = false
			textEl.style.borderBottom = ""
			state.items.push(item)
			save()
			itemEl.onmouseenter = onMouseEnter
			itemEl.onmouseleave = onMouseLeave
			textEl.oninput = normalOnInput
			createEmptyItem()
		}
		textEl.oninput = () => {
			item.html = textEl.innerHTML
			saveAndCreateNew()
		}
	}
	createEmptyItem()
	return el
})
