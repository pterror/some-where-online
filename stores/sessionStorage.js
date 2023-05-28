registerStore("sessionStorage", {
  get: async (key) => JSON.parse(/** @type {string} */ (sessionStorage.getItem(key))),
  set: async (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
  delete: async (key) => sessionStorage.removeItem(key),
  list: async () => Object.keys(sessionStorage)
})
