(() => {
	/** @type {Record<string, any>} */
	const SESSION_STORE = Object.create(null)
	registerStore("session", {
		get: async (key) => SESSION_STORE[key],
		set: async (key, value) => { SESSION_STORE[key] = value },
		delete: async (key) => { delete SESSION_STORE[key] },
		list: async () => Object.keys(SESSION_STORE)
	})
})
