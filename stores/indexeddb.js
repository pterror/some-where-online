registerStore(
	"indexeddb",
	(() => {
		/** @type {Promise<IDBDatabase>} */
		const db = new Promise((ret, err) => {
			const open = indexedDB.open("somewhereonline", 1)
			open.onerror = err
			open.onsuccess = () => ret(open.result)
			open.onupgradeneeded = () => {
				const db = open.result
				db.createObjectStore("")
			}
		})
		return {
			get: (key) => new Promise(async (ret, err) => {
				const req = await db.then(db => db.transaction("", "readonly").objectStore("").get(key))
				req.onerror = err
				req.onsuccess = () => ret(req.result)
			}),
			set: (key, value) => new Promise(async (ret, err) => {
				const req = await db.then(db => db.transaction("", "readwrite").objectStore("").put(value, key))
				req.onerror = err
				req.onsuccess = () => ret()
			}),
			delete: (key) => new Promise(async (ret, err) => {
				const req = await db.then(db => db.transaction("", "readwrite").objectStore("").delete(key))
				req.onerror = err
				req.onsuccess = () => ret()
			}),
			list: () => new Promise(async (ret, err) => {
				const req = await db.then(db => db.transaction("", "readwrite").objectStore("").getAllKeys())
				req.onerror = err
				req.onsuccess = () => ret(req.result.filter(
					/** @return {key is string} */
					key => typeof key === 'string'
				))
			}),
		}
	})()
)
