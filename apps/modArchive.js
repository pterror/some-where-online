/// <reference path="../dependencies/chiptune2.d.ts" />

(() => {
	const openMpt = document.createElement("script")
	openMpt.src = "dependencies/libopenmpt.js"
	document.body.appendChild(openMpt)
	const chiptune2 = document.createElement("script")
	chiptune2.src = "https://cdn.jsdelivr.net/gh/deskjet/chiptune2.js@master/chiptune2.js"
	document.body.appendChild(chiptune2)
})()

registerPanel("modArchive", () => {
	// IMPL
	const player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1))
	const blobPromise = fetch("https://modarchive.org/index.php?request=view_random")
		.then(response => response.text())
		.then(text => player.load(`https://modarchive.org/jsplayer.php?moduleid=${text.match(/module.php?(\d+)/)?.[1] ?? '1'}`, buffer => {
			player.play(buffer)
			if (player.context.state === 'running') {
				// TODO
			} else {
				// TODO
			}
		}))
	const el = document.createElement("div")
	return el
})