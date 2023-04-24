/// <reference path="../dependencies/chiptune2.d.ts" />

loadPlugin({
	name: 'modArchive',
	scripts: [
		// FIXME: they don't release an extracted file
		/* ['dependencies/libopenmpt.js', () => {
			delete window['libopenmpt']
		}], */
		['https://cdn.jsdelivr.net/gh/deskjet/chiptune2.js@master/chiptune2.js', () => {
			delete window['ChiptuneAudioContext']
			delete window['ChiptuneJsConfig']
			delete window['ChiptuneJsPlayer']
		}],
	],
	load() {
		// IMPL
		const player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1))
		const blobPromise = fetch('https://modarchive.org/index.php?request=view_random')
			.then(response => response.text())
			.then(text => player.load(`https://modarchive.org/jsplayer.php?moduleid=${text.match(/module.php?(\d+)/)?.[1] ?? '1'}`, buffer => {
				player.play(buffer)
				if (player.context.state === 'running') {
					// TODO
				} else {
					// TODO
				}
			}))
	},
})