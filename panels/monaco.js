(() => {
	const type = 't' in globalThis ? t.struct({ code: t.string }) : undefined
	const isType = type && typeValidator(type)
	/** @type {() => void} */
	let resolveLoaded
	/** @type {Promise<void>} */
	const loaded = new Promise(resolve => { resolveLoaded = resolve })
	const monacoEl = document.createElement("script")
	monacoEl.src = "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.1/min/vs/loader.js"
	monacoEl.onload = () => {
		require.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.37.1/min/vs" } });
		require(["vs/editor/editor.main"], () => {
			resolveLoaded()
		})
	}
	document.body.appendChild(monacoEl)
	registerPanel(
		"monaco",
		/** @param {{ store?: string, key?: string }} [x] */
		({ store = "indexeddb", key = "global/monaco" } = {}) => {
			const x = { store, key }
			// TODO: allow setting language
			const el = document.createElement("div")
			;(async () => {
				/** @type {(x_: typeof x) => Promise<TypeOf<typeof type>>} */
				const load = (x) => storeGet(x.store, x.key)
				/** @param {typeof x} x */
				const save = (x) => storeSet(x.store, x.key, state)
				let state = await load(x) ?? { code: "" }
				await loaded
				const editor = monaco.editor.create(el, {
					// FIXME: automatic layout broken
					value: state.code, automaticLayout: true, theme: "dracula"
				})
				registerSwoDragDrop(el, loadIfValid(x, load, save, newState => {
					editor.setValue((state = newState).code)
				}, isType))
				editor.onDidChangeModelContent(() => {
					state.code = editor.getValue()
					save(x)
				})
			})()
			return el
		},
	)

	loaded.then(() => {
		// https://github.com/brijeshb42/monaco-themes/blob/6fee3ad661ef759ffef5bad48779d91a6507ff15/themes/Dracula.json
		monaco.editor.defineTheme("dracula", {
			"base": "vs-dark",
			"inherit": true,
			"rules": [
				{
					"background": "282a36",
					"token": ""
				},
				{
					"foreground": "6272a4",
					"token": "comment"
				},
				{
					"foreground": "f1fa8c",
					"token": "string"
				},
				{
					"foreground": "bd93f9",
					"token": "constant.numeric"
				},
				{
					"foreground": "bd93f9",
					"token": "constant.language"
				},
				{
					"foreground": "bd93f9",
					"token": "constant.character"
				},
				{
					"foreground": "bd93f9",
					"token": "constant.other"
				},
				{
					"foreground": "ffb86c",
					"token": "variable.other.readwrite.instance"
				},
				{
					"foreground": "ff79c6",
					"token": "constant.character.escaped"
				},
				{
					"foreground": "ff79c6",
					"token": "constant.character.escape"
				},
				{
					"foreground": "ff79c6",
					"token": "string source"
				},
				{
					"foreground": "ff79c6",
					"token": "string source.ruby"
				},
				{
					"foreground": "ff79c6",
					"token": "keyword"
				},
				{
					"foreground": "ff79c6",
					"token": "storage"
				},
				{
					"foreground": "8be9fd",
					"fontStyle": "italic",
					"token": "storage.type"
				},
				{
					"foreground": "50fa7b",
					"fontStyle": "underline",
					"token": "entity.name.class"
				},
				{
					"foreground": "50fa7b",
					"fontStyle": "italic underline",
					"token": "entity.other.inherited-class"
				},
				{
					"foreground": "50fa7b",
					"token": "entity.name.function"
				},
				{
					"foreground": "ffb86c",
					"fontStyle": "italic",
					"token": "variable.parameter"
				},
				{
					"foreground": "ff79c6",
					"token": "entity.name.tag"
				},
				{
					"foreground": "50fa7b",
					"token": "entity.other.attribute-name"
				},
				{
					"foreground": "8be9fd",
					"token": "support.function"
				},
				{
					"foreground": "6be5fd",
					"token": "support.constant"
				},
				{
					"foreground": "66d9ef",
					"fontStyle": " italic",
					"token": "support.type"
				},
				{
					"foreground": "66d9ef",
					"fontStyle": " italic",
					"token": "support.class"
				},
				{
					"foreground": "f8f8f0",
					"background": "ff79c6",
					"token": "invalid"
				},
				{
					"foreground": "f8f8f0",
					"background": "bd93f9",
					"token": "invalid.deprecated"
				},
				{
					"foreground": "cfcfc2",
					"token": "meta.structure.dictionary.json string.quoted.double.json"
				},
				{
					"foreground": "6272a4",
					"token": "meta.diff"
				},
				{
					"foreground": "6272a4",
					"token": "meta.diff.header"
				},
				{
					"foreground": "ff79c6",
					"token": "markup.deleted"
				},
				{
					"foreground": "50fa7b",
					"token": "markup.inserted"
				},
				{
					"foreground": "e6db74",
					"token": "markup.changed"
				},
				{
					"foreground": "bd93f9",
					"token": "constant.numeric.line-number.find-in-files - match"
				},
				{
					"foreground": "e6db74",
					"token": "entity.name.filename"
				},
				{
					"foreground": "f83333",
					"token": "message.error"
				},
				{
					"foreground": "eeeeee",
					"token": "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json"
				},
				{
					"foreground": "eeeeee",
					"token": "punctuation.definition.string.end.json - meta.structure.dictionary.value.json"
				},
				{
					"foreground": "8be9fd",
					"token": "meta.structure.dictionary.json string.quoted.double.json"
				},
				{
					"foreground": "f1fa8c",
					"token": "meta.structure.dictionary.value.json string.quoted.double.json"
				},
				{
					"foreground": "50fa7b",
					"token": "meta meta meta meta meta meta meta.structure.dictionary.value string"
				},
				{
					"foreground": "ffb86c",
					"token": "meta meta meta meta meta meta.structure.dictionary.value string"
				},
				{
					"foreground": "ff79c6",
					"token": "meta meta meta meta meta.structure.dictionary.value string"
				},
				{
					"foreground": "bd93f9",
					"token": "meta meta meta meta.structure.dictionary.value string"
				},
				{
					"foreground": "50fa7b",
					"token": "meta meta meta.structure.dictionary.value string"
				},
				{
					"foreground": "ffb86c",
					"token": "meta meta.structure.dictionary.value string"
				}
			],
			"colors": {
				"editor.foreground": "#f8f8f2",
				"editor.background": "#282a36",
				"editor.selectionBackground": "#44475a",
				"editor.lineHighlightBackground": "#44475a",
				"editorCursor.foreground": "#f8f8f0",
				"editorWhitespace.foreground": "#3B3A32",
				"editorIndentGuide.activeBackground": "#9D550FB0",
				"editor.selectionHighlightBorder": "#222218"
			}
		})
	})
})()
