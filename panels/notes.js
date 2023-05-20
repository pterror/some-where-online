// wishlist: timestamps? sorting? markdown?
// - drag'n'drop to reorder
// - buttons to copy and delete
(() => {
	const type = 't' in globalThis ? t.struct({ items: t.array(t.struct({ html: t.string })) }) : undefined
	const isType = type && typeValidator(type)
	registerPanel(
		"notes",
		/** @param {{ store?: string, key?: string }} [x] */
		({ store = "indexeddb", key = "global/notes" } = {}) => {
			const x = { store, key }
			const el = document.createElement("div")
			const actionsEl = document.createElement("div")
			Object.assign(actionsEl.style, { float: "right", display: "flex", height: "0" })
			const deleteEl = actionsEl.appendChild(document.createElement("div"))
			deleteEl.style.cursor = "pointer"
			deleteEl.innerText = "🗑️"
			const listEl = el.appendChild(document.createElement("div"))
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
				/** @param {{ html: string }} item */
				const render = (item) => {
					const itemEl = listEl.appendChild(document.createElement("div"))
					Object.assign(itemEl.style, {
						background: "var(--secondary-bg)", margin: "0.5rem", display: "flex",
						minHeight: "2lh",
					})
					const contentEl = itemEl.appendChild(document.createElement("div"))
					contentEl.style.flex = "1 0 auto"
					contentEl.contentEditable = "true"
					contentEl.innerHTML = item.html
					contentEl.oninput = () => { item.html = contentEl.innerHTML; save(x) }
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
					itemEl.onmouseleave = () => { itemEl.removeChild(actionsEl) }
					return { itemEl, contentEl }
				}
				const createEmptyItem = () => {
					const item = { html: "" }
					const { itemEl, contentEl } = render(item)
					const onMouseEnter = itemEl.onmouseenter
					itemEl.onmouseenter = null
					const onMouseLeave = itemEl.onmouseleave
					itemEl.onmouseleave = null
					const normalOnInput = contentEl.oninput
					contentEl.oninput = () => {
						onMouseEnter?.call(itemEl, new MouseEvent("mouseenter"))
						item.html = contentEl.innerHTML
						state.items.push(item)
						save(x)
						itemEl.onmouseenter = onMouseEnter
						itemEl.onmouseleave = onMouseLeave
						contentEl.oninput = normalOnInput
						createEmptyItem()
					}
				}
				for (const item of state.items) { render(item) }
				createEmptyItem()
			})()
			return el
		},
	)
})()
