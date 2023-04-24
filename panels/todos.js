loadPanelType("todos", () => {
	/** @type {{ items: { done: boolean, html: string }[] }} */
	// @ts-expect-error
	const state = JSON.parse(localStorage.getItem("so_todos")) ?? { items: [] }
	const save = () => { localStorage.setItem("so_todos", JSON.stringify(state)) }
	const el = document.createElement("div")
	const headingEl = el.appendChild(document.createElement("h1"))
	headingEl.innerText = "todos"
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
	for (const item of state.items) {
		const itemEl = listEl.appendChild(document.createElement("div"))
		itemEl.style.display = "flex"
		const checkboxEl = itemEl.appendChild(document.createElement("input"))
		checkboxEl.style.margin = "0 0.5rem"
		checkboxEl.type = "checkbox"
		checkboxEl.checked = item.done
		const textEl = itemEl.appendChild(document.createElement("div"))
		textEl.style.flex = "1 0 auto"
		textEl.contentEditable = "true"
		textEl.innerHTML = item.html
		checkboxEl.onchange = () => {
			item.done = checkboxEl.checked
			style(textEl, checkboxEl.checked)
			save()
		}
		textEl.oninput = () => {
			item.html = textEl.innerHTML
			save()
		}
		style(textEl, checkboxEl.checked)
	}
	const createEmptyItem = () => {
		const item = { done: false, html: "" }
		const itemEl = listEl.appendChild(document.createElement("div"))
		itemEl.style.display = "flex"
		const checkboxEl = itemEl.appendChild(document.createElement("input"))
		checkboxEl.style.margin = "0 0.5rem"
		checkboxEl.type = "checkbox"
		const textEl = itemEl.appendChild(document.createElement("div"))
		textEl.style.flex = "1 0 auto"
		textEl.contentEditable = "true"
		const normalOnChecked = () => {
			item.done = checkboxEl.checked
			style(textEl, checkboxEl.checked)
			save()
		}
		const normalOnInput = () => {
			item.html = textEl.innerHTML
			save()
		}
		const saveAndCreateNew = () => {
			state.items.push(item)
			save()
			checkboxEl.onchange = normalOnChecked
			textEl.oninput = normalOnInput
			createEmptyItem()
		}
		checkboxEl.onchange = () => {
			item.done = checkboxEl.checked
			style(textEl, checkboxEl.checked)
			saveAndCreateNew()
		}
		textEl.oninput = () => {
			item.html = textEl.innerHTML
			saveAndCreateNew()
		}
	}
	createEmptyItem()
	return el
})
