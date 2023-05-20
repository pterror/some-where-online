/// <reference lib="WebWorker" />

(self => {
	self.addEventListener("install", () => {
		Promise.all([
			fetch("assets.json").then(res => /** @type {Promise<string[]>} */ (res.json())),
			caches.open(""),
		]).then(({ 0: assets, 1: cache }) => {
			cache.addAll(assets)
		})
	})

	self.addEventListener("fetch", event => {
		event.respondWith(
			caches.open("").then(async cache => {
				const response = await cache.match(event.request)
				const fetchPromise = fetch(event.request).then(res => {
					cache.put(event.request, res.clone())
					return res
				})
				return response || fetchPromise
			})
		)
	})
	// @ts-expect-error
})(/** @type {ServiceWorkerGlobalScope} */ (self))
