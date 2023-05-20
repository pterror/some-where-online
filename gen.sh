#!/usr/bin/env sh
cat <<'END' > assets.json
[
	"index.html",
	"index.js",
END
for f in $(find dependencies -name '*.js'); do echo '	"'"$f"'",' >> assets.json; done
for f in $(find panels -name '*.js'); do echo '	"'"$f"'",' >> assets.json; done
for f in $(find stores -name '*.js'); do echo '	"'"$f"'",' >> assets.json; done
# the styles are missing. also the user should be able to select which plugins to load
cat <<'END' >> assets.json
	"https://cdn.jsdelivr.net/npm/ace-builds@1.18.0/src-min-noconflict/ace.min.js",
	"https://cdn.jsdelivr.net/npm/monaco-editor@0.37.1/min/vs/loader.js",
	"https://cdn.jsdelivr.net/npm/tinymce@6.4.1/tinymce.min.js"
]
END
