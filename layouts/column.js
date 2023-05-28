registerLayout("column", item => {
	const el = document.createElement("div")
	Object.assign(el.style, { display: "flex", flexFlow: "column nowrap", flex: "1 0 0" })
	/** @param {DragEvent} event */
	const isAppDragDrop = event => {
		return event.dataTransfer?.items.length === 1 && event.dataTransfer?.items[0]?.kind === "string" &&
			event.dataTransfer.items[0].type === "application/json+swo-app"
	}
	const dropzoneBeforeEl = document.createElement("div")
	Object.assign(dropzoneBeforeEl.style, {
		zIndex: "999999", position: "relative", left: "0", flex: "0 0 0", background: "#8888a888",
		paddingTop: "32px", margin: "0 36px -32px 36px",
	})
	const dropzoneAfterEl = document.createElement("div")
	Object.assign(dropzoneAfterEl.style, {
		zIndex: "999999", position: "relative", right: "0", flex: "0 0 0", background: "#8888a888",
		paddingBottom: "32px", margin: "-32px 36px 0 36px",
	})
	dropzoneBeforeEl.ondragenter = dropzoneBeforeEl.ondragover = dropzoneAfterEl.ondragenter = dropzoneAfterEl.ondragover = event => {
		if (!isAppDragDrop(event)) { return }
		event.preventDefault()
	}
	dropzoneBeforeEl.ondragleave = dropzoneAfterEl.ondragleave = event => {
		if (event.relatedTarget === document.body) { dropzoneBeforeEl.remove(); dropzoneAfterEl.remove() }
	}
	for (const child of item.children) {
		const childEl = render(el, child.layout, false)
		const size = child.size ?? "1fr"
		childEl.style.flex = /^\d+(\.\d*)?fr/.test(size) ? `${size.slice(0, -2)} 0 0` : `0 0 ${child.size}`
		let depth = 0
		/** @param {DragEvent} event */
		const onDragEnter = event => {
			depth += 1
			if (depth !== 1) { return }
			if (!isAppDragDrop(event)) { return }
			childEl.insertAdjacentElement("beforebegin", dropzoneBeforeEl)
			childEl.insertAdjacentElement("afterend", dropzoneAfterEl)
			// TODO: show only when the item is an application/json+swo-app
			// TODO: change ondragend
		}
		childEl.addEventListener("dragenter", onDragEnter)
		/** @param {DragEvent} event */
		const onDragLeave = event => {
			depth -= 1
			if (depth !== 0) { return }
			if (event.relatedTarget !== dropzoneBeforeEl && event.relatedTarget !== dropzoneAfterEl) {
				dropzoneBeforeEl.remove()
				dropzoneAfterEl.remove()
			}
		}
		childEl.addEventListener("dragleave", onDragLeave)
	}
	return el
})
