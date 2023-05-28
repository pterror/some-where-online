(() => {
	const type = 't' in globalThis ? t.struct({
		nextId: t.number,
		type: t.literal('directory'),
		items: t.dictionary(t.string, t.number)
	}) : undefined
	const isType = type && typeValidator(type)
	registerPanel(
		"fileTree",
		// TODO: consider letting users open a subpath (specifying an initial id)
		/** @param {{ store?: string, key?: string }} [x] */
		({ store = "indexeddb", key = "global/fileTree" } = {}) => {
			const x = { store, key }
			const el = document.createElement("div")
			const actionsEl = document.createElement("div")
			Object.assign(actionsEl.style, { float: "right", display: "flex", height: "0" })
			const newFileEl = actionsEl.appendChild(document.createElement("div"))
			newFileEl.style.cursor = "pointer"
			newFileEl.innerText = "🗎"
			const newDirectoryEl = actionsEl.appendChild(document.createElement("div"))
			newDirectoryEl.style.cursor = "pointer"
			newDirectoryEl.innerText = "📁"
			const renameEl = actionsEl.appendChild(document.createElement("div"))
			renameEl.style.cursor = "pointer"
			renameEl.innerText = "𝙸"
			const deleteEl = actionsEl.appendChild(document.createElement("div"))
			deleteEl.style.cursor = "pointer"
			deleteEl.innerText = "🗑️"
			;(async () => {
				// TODO: actual shape
				/** @type {(x_: typeof x) => Promise<TypeOf<typeof type>>} */
				const load = (x) => storeGet(x.store, x.key)
				/** @param {typeof x} x */
				const save = (x) => storeSet(x.store, x.key, state)
				/** @typedef {{ type: "directory", items: Record<string, number> }} DirectoryItem */
				/** @typedef {{ type: "file", contents: Uint8Array }} FileItem */
				/** @typedef {DirectoryItem | FileItem} Item */
				/** @type {(id: number) => Promise<Item>} */
				const loadItem = (id) => storeGet(x.store, `${x.key}/${id}`)
				/** @type {(id: number, value: Item) => Promise<void>} */
				const saveItem = (id, value) => storeSet(x.store, `${x.key}/${id}`, value)
				/** @type {(id: number) => Promise<void>} */
				const deleteItem = (id) => storeDelete(x.store, `${x.key}/${id}`)
				/** @type {(parentId: number, parentItem: DirectoryItem, id: number, oldName: string | undefined, newName: string | undefined) => Promise<void>} */
				const renameItem = async (parentId, parentItem, id, oldName, newName) => {
					if (id === undefined) {
						console.error("The root directory cannot be renamed")
						return
					}
					if (oldName === undefined && newName === undefined) {
						console.error("Both the old name and the new name are undefined")
						return
					}
					if (oldName !== undefined) { delete parentItem.items[oldName] }
					if (newName !== undefined) { parentItem.items[newName] = id }
					else { await deleteItem(id) }
					await saveItem(parentId, parentItem)
				}
				let state = await load(x) ?? { nextId: 1, type: "directory", items: {} }
				registerSwoDragDrop(el, loadIfValid(x, load, save, newState => {
					state = newState
					itemEl.remove()
					// @ts-expect-error
					;({ itemEl, nameEl } = render(el, "(root)", undefined, undefined, undefined, state))
				}, isType))
				/** @param {HTMLElement} container @param {string | undefined} name @param {number} parentId @param {DirectoryItem} parentItem @param {number} id @param {Item} item */
				const render = (container, name, parentId, parentItem, id, item) => {
					const itemEl = container.appendChild(document.createElement("div"))
					const nameRowEl = itemEl.appendChild(document.createElement("div"))
					nameRowEl.style.display = "flex"
					nameRowEl.style.cursor = item.type === "directory" ? "pointer" : "grab"
					const nameEl = nameRowEl.appendChild(document.createElement("div"))
					nameEl.innerText = name ?? ""
					if (name === undefined) { nameEl.contentEditable = "true"; setTimeout(() => nameEl.focus(), 0) }
					/** @type {HTMLDivElement | undefined} */
					let toggleEl
					/** @type {HTMLDivElement | undefined} */
					let itemsEl
					Object.assign(nameEl.style, { flex: "1 0 auto", color: "unset" })
					if (parentItem !== undefined) {
						nameEl.ondragstart = (event) => {
							event.dataTransfer?.setData("application/json+swo-locator", JSON.stringify({ store: x.store, key: `${x.key}/${id}` }))
						}
						// TODO: consider opening file in default panel (whatever that is)
						// nameEl.ondblclick = () => {}
						const cancelEditingName = () => {
							if (id === undefined) { nameEl.onblur = null; itemEl.remove() }
							nameEl.innerText = name ?? ""
							nameEl.contentEditable = "false"
						}
						nameEl.onblur = cancelEditingName
						nameEl.onkeydown = event => {
							if (event.key === "Escape" && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
								cancelEditingName()
							} else if (event.key === "Enter" && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
								if (nameEl.innerText !== name) {
									if (id === undefined) {
										id = state.nextId++
										saveItem(id, item)
										save(x)
									}
									renameItem(parentId, parentItem, id, name, nameEl.innerText)
									name = nameEl.innerText
								}
								cancelEditingName()
							}
						}
					}
					nameRowEl.onmouseleave = () => { nameRowEl.removeChild(actionsEl) }
					switch (item.type) {
						case "directory": {
							toggleEl = nameRowEl.insertBefore(document.createElement("div"), nameEl)
							const toggleEl_ = toggleEl
							itemsEl = itemEl.appendChild(document.createElement("div"))
							itemsEl.style.marginLeft = "0.5em"
							const itemsEl_ = itemsEl
							itemsEl.hidden = true
							const setToggle = () => { toggleEl_.innerText = itemsEl_.hidden ? "ᐳ" : "ᐯ" }
							setToggle()
							nameRowEl.onclick = () => { itemsEl_.hidden = !itemsEl_.hidden; setToggle() }
							nameRowEl.onmouseenter = () => {
								nameRowEl.appendChild(actionsEl)
								newFileEl.hidden = false
								newDirectoryEl.hidden = false
								renameEl.hidden = parentId === undefined
								deleteEl.hidden = parentId === undefined
								newFileEl.onclick = (event) => {
									event.stopPropagation()
									itemsEl_.hidden = false
									setToggle()
									createEmptyFile(itemsEl_, id, item)
								}
								newDirectoryEl.onclick = (event) => {
									event.stopPropagation()
									itemsEl_.hidden = false
									setToggle()
									createEmptyDirectory(itemsEl_, id, item)
								}
								renameEl.onclick = () => { nameEl.contentEditable = "true" }
								deleteEl.onclick = () => {
									renameItem(parentId, parentItem, id, nameEl.innerText, undefined)
								}
							}
							(async () => {
								for (const { 0: name, 1: childId } of Object.entries(item.items)) {
									render(itemsEl, name, id, item, childId, await loadItem(childId))
								}
							})()
							break
						}
						case "file": {
							nameRowEl.onmouseenter = () => {
								nameRowEl.appendChild(actionsEl)
								newFileEl.hidden = true
								newDirectoryEl.hidden = true
								renameEl.hidden = false
								deleteEl.hidden = false
								renameEl.onclick = () => { nameEl.contentEditable = "true" }
								deleteEl.onclick = () => {
									renameItem(parentId, parentItem, id, nameEl.innerText, undefined)
								}
							}
							break
						}
					}
					return { itemEl, nameRowEl, nameEl, toggleEl, itemsEl }
				}
				/** @param {HTMLElement} container @param {number} parentId @param {DirectoryItem} parentItem */
				const createEmptyFile = (container, parentId, parentItem) => {
					/** @type {FileItem} */
					const item = { type: "file", contents: new Uint8Array() }
					// @ts-expect-error
					render(container, undefined, parentId, parentItem, undefined, item)
				}
				/** @param {HTMLElement} container @param {number} parentId @param {DirectoryItem} parentItem */
				const createEmptyDirectory = (container, parentId, parentItem) => {
					/** @type {DirectoryItem} */
					const item = { type: "directory", items: {} }
					// @ts-expect-error
					render(container, undefined, parentId, parentItem, undefined, item)
				}
				// @ts-expect-error
				let { itemEl, nameEl } = render(el, "(root)", undefined, undefined, undefined, state)
			})()
			// TODO: switch to empty element that becomes a regular list item + ???s on change
			return el
		},
	)
})()
