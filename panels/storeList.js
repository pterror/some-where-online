(() => {
	registerPanel(
		"storeList",
		/** @param {{ store?: string }} [x] */
		({ store = "indexeddb" } = {}) => {
			const x = { store }
			const el = document.createElement("div")
			const actionsEl = document.createElement("div")
			Object.assign(actionsEl.style, { float: "right", display: "flex", height: "0" })
			const deleteEl = actionsEl.appendChild(document.createElement("div"))
			deleteEl.style.cursor = "pointer"
			deleteEl.innerText = "🗑️"
			const listEl = el.appendChild(document.createElement("div"))
			;(async () => {
				/** @param {{ name: string }} item */
				const render = (item) => {
					const itemEl = listEl.appendChild(document.createElement("div"))
          itemEl.style.cursor = "grab"
          itemEl.innerText = item.name
					itemEl.onmouseenter = () => {
						itemEl.appendChild(actionsEl)
						deleteEl.onclick = () => {
              storeDelete(store, item.name)
							itemEl.remove()
							if (listEl.children.length === 0) { createEmptyItem() }
						}
					}
					itemEl.onmouseleave = () => { itemEl.removeChild(actionsEl) }
					return { itemEl }
				}
				const createEmptyItem = () => {
					const item = { name: "" }
					const { itemEl } = render(item)
					const onMouseEnter = itemEl.onmouseenter
					itemEl.onmouseenter = null
					const onMouseLeave = itemEl.onmouseleave
					itemEl.onmouseleave = null
          itemEl.style.cursor = ""
					itemEl.contentEditable = "true"
					itemEl.onkeydown = (event) => {
            if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
              itemEl.style.cursor = "grab"
              itemEl.onkeydown = null
              itemEl.contentEditable = "false"
              storeSet(x.store, itemEl.innerText, null)
            }
						itemEl.onmouseenter = onMouseEnter
						itemEl.onmouseleave = onMouseLeave
						createEmptyItem()
					}
				}
				for (const item of await storeList(x.store)) { render({ name: item }) }
				createEmptyItem()
			})()
			return el
		},
	)
})()
