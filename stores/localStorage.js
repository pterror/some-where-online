registerStore("localStorage", {
  get: async (key) => JSON.parse(/** @type {string} */ (localStorage.getItem(key))),
  set: async (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  delete: async (key) => localStorage.removeItem(key),
  list: async () => Object.keys(localStorage)
})
