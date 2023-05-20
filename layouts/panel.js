registerLayout("panel", item => {
	const ctor = SWO.PANEL_CONSTRUCTORS[item.panelType]
	if (!ctor) {
		console.error("Unknown panel type: " + item.panelType)
		return document.createElement("div")
	}
	return ctor(item.options ?? {})
})
