(() =>{
	const type = 't' in globalThis ? t.struct({ items: t.array(t.struct({ done: t.boolean, html: t.string })) }) : undefined
	const isType = type && typeValidator(type)
	registerPanel(
		"todos",
		/** @param {{ store?: string, key?: string }} [x] */
		({ store = "indexeddb", key = "global/todos" } = {}) => {
			const x = { store, key }
			const el = document.createElement("div")
			const actionsEl = document.createElement("div")
			Object.assign(actionsEl.style, { float: "right", display: "flex", height: "0" })
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
			;(async () => {
				/** @type {(x_: typeof x) => Promise<TypeOf<typeof type>>} */
				const load = (x) => storeGet(x.store, x.key)
				/** @param {typeof x} x */
				const save = (x) => storeSet(x.store, x.key, state)
				let state = await load(x) ?? { items: [] }
				registerSwoDragDrop(el, loadIfValid(x, load, save, newState => {
					state = newState
					while (listEl.firstChild) { listEl.removeChild(listEl.firstChild) }
					for (const item of state.items) {
						render(item)
					}
					createEmptyItem()
				}, isType))
				/** @param {{ done: boolean, html: string }} item */
				const render = (item) => {
					const itemEl = listEl.appendChild(document.createElement("div"))
					itemEl.style.display = "flex"
					itemEl.onmouseenter = () => {
						itemEl.appendChild(actionsEl)
						deleteEl.onclick = () => {
							state.items.splice(state.items.indexOf(item), 1)
							save(x)
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
						save(x)
					}
					const textEl = itemEl.appendChild(document.createElement("div"))
					textEl.style.flex = "1 0 auto"
					textEl.contentEditable = "true"
					textEl.innerHTML = item.html
					textEl.oninput = () => {
						item.html = textEl.innerHTML
						save(x)
					}
					style(textEl, checkboxEl.checked)
					return { itemEl, checkboxEl, textEl }
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
						onMouseEnter?.call(itemEl, new MouseEvent("mouseenter"))
						checkboxEl.disabled = false
						textEl.style.borderBottom = ""
						state.items.push(item)
						save(x)
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
				for (const item of state.items) {
					render(item)
				}
				createEmptyItem()
			})()
			return el
		},
	)
})()
