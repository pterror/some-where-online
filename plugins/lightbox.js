// TODO: plugin for modal component?
loadPlugin({
  name: 'lightbox',
  load() {},
  elements: {
    lightbox(_, attributes, children) {
      const el = document.createElement("div")
      Object.assign(el.style, {
        position: "fixed", top: "0", left: "0", height: "100vh", width: "100vw",
        display: "grid", placeItems: "center", background: "#00000080",
      })
      el.addEventListener("click", event => {
        if (event.target === event.currentTarget) {
          event.preventDefault()
          event.stopPropagation()
          el.remove()
        }
      })
      for (const { 0: name, 1: value } of Object.entries(attributes)) {
        el.setAttribute(name, value)
      }
      render(el, children)
      return [el]
    }
  },
})
