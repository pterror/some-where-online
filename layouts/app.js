registerLayout("app", item => {
	const ctor = SWO.APP_CONSTRUCTORS[item.appType]
	if (!ctor) {
		console.error("Unknown app type: " + item.appType)
		return document.createElement("div")
	}
	return ctor(item.options ?? {})
})
