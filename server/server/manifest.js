const manifest = {
	appDir: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		entry: {"file":"_app/immutable/start-1963f8e7.js","imports":["_app/immutable/start-1963f8e7.js","_app/immutable/chunks/preload-helper-aa6bc0ce.js","_app/immutable/chunks/index-beb4732d.js","_app/immutable/chunks/singletons-1abee5b3.js"],"stylesheets":[]},
		nodes: [
			() => import('./chunks/0-0322f1a5.js'),
			() => import('./chunks/1-a1918101.js'),
			() => import('./chunks/2-4847ce70.js'),
			() => import('./chunks/3-e7571f7a.js'),
			() => import('./chunks/4-c033ae91.js'),
			() => import('./chunks/5-2b702235.js'),
			() => import('./chunks/6-ac674246.js'),
			() => import('./chunks/7-cef4ab8b.js'),
			() => import('./chunks/8-df4a8255.js')
		],
		routes: [
			{
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			},
			{
				id: "add",
				pattern: /^\/add\/?$/,
				names: [],
				types: [],
				page: null,
				endpoint: () => import('./chunks/_server.ts-121e0c14.js')
			},
			{
				id: "projects.json",
				pattern: /^\/projects\.json$/,
				names: [],
				types: [],
				page: null,
				endpoint: () => import('./chunks/_server.ts-3c798e69.js')
			},
			{
				id: "run/[id]",
				pattern: /^\/run\/([^/]+?)\/?$/,
				names: ["id"],
				types: [null],
				page: null,
				endpoint: () => import('./chunks/_server.ts-5d7d1cfc.js')
			},
			{
				id: "[project]",
				pattern: /^\/([^/]+?)\/?$/,
				names: ["project"],
				types: [null],
				page: { layouts: [0,2], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "[project]/collection",
				pattern: /^\/([^/]+?)\/collection\/?$/,
				names: ["project"],
				types: [null],
				page: { layouts: [0,2], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "[project]/function",
				pattern: /^\/([^/]+?)\/function\/?$/,
				names: ["project"],
				types: [null],
				page: { layouts: [0,2], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "[project]/collection/[name]",
				pattern: /^\/([^/]+?)\/collection\/([^/]+?)\/?$/,
				names: ["project","name"],
				types: [null,null],
				page: { layouts: [0,2], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "[project]/function/[name]",
				pattern: /^\/([^/]+?)\/function\/([^/]+?)\/?$/,
				names: ["project","name"],
				types: [null,null],
				page: { layouts: [0,2], errors: [1,,], leaf: 8 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};

export { manifest };
//# sourceMappingURL=manifest.js.map
