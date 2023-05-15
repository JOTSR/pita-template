// import { build } from 'esbuild'
// // import { httpImports } from 'https://deno.land/x/esbuild_plugin_http_imports@v1.3.0/index.ts'
// // import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.7.0/mod.ts";
// // import { bundle } from 'https://deno.land/x/emit@0.21.1/mod.ts'
// // import * as importMap from "https://esm.sh/esbuild-plugin-import-map";
// import * as importMap from 'npm:esbuild-plugin-import-map'
// import importMapFile from '../import_map.json' assert { type: 'json' }
// // const contents = (await bundle('./js/app.tsx')).
// importMap.load([importMapFile])
// await build({
// 	entryPoints: ['js/app.tsx'],
// 	bundle: true,
// 	minify: true,
// 	sourcemap: true,
// 	format: 'esm',
// 	loader: {
// 		'.json': 'json',
// 	},
// 	target: ['chrome100', 'firefox100'],
// 	// plugins: [...denoPlugins({ configPath: import.meta.resolve('./deno.jsonc'), importMapURL: import.meta.resolve('../import_map.json') })],
// 	plugins: [importMap.load()],
// 	outfile: 'js/app_esb.js',
// })

// const bundled = await bundle('./js/app.tsx')
// console.log(bundled)
