export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		entry: {"file":"_app/immutable/start-5932a68c.js","imports":["_app/immutable/start-5932a68c.js","_app/immutable/chunks/index-5e43de0b.js","_app/immutable/chunks/singletons-f5671f33.js","_app/immutable/chunks/index-ac35e321.js","_app/immutable/chunks/preload-helper-aa6bc0ce.js","_app/immutable/chunks/control-03134885.js"],"stylesheets":[]},
		nodes: [
			() => import('../output/server/nodes/0.js'),
			() => import('../output/server/nodes/1.js'),
			() => import('../output/server/nodes/2.js'),
			() => import('../output/server/nodes/3.js'),
			() => import('../output/server/nodes/4.js'),
			() => import('../output/server/nodes/5.js'),
			() => import('../output/server/nodes/6.js'),
			() => import('../output/server/nodes/7.js'),
			() => import('../output/server/nodes/8.js'),
			() => import('../output/server/nodes/9.js'),
			() => import('../output/server/nodes/10.js'),
			() => import('../output/server/nodes/11.js'),
			() => import('../output/server/nodes/12.js'),
			() => import('../output/server/nodes/13.js'),
			() => import('../output/server/nodes/14.js')
		],
		routes: [
			{
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				page: { layouts: [0], errors: [1], leaf: 5 },
				endpoint: null
			},
			{
				id: "api",
				pattern: /^\/api\/?$/,
				names: [],
				types: [],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_server.ts.js')
			},
			{
				id: "projects",
				pattern: /^\/projects\/?$/,
				names: [],
				types: [],
				page: { layouts: [0], errors: [1], leaf: 14 },
				endpoint: null
			},
			{
				id: "api/set-cookie",
				pattern: /^\/api\/set-cookie\/?$/,
				names: [],
				types: [],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/set-cookie/_server.ts.js')
			},
			{
				id: "api/[project]",
				pattern: /^\/api\/([^/]+?)\/?$/,
				names: ["project"],
				types: [null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/_server.ts.js')
			},
			{
				id: "api/[project]/apikeys",
				pattern: /^\/api\/([^/]+?)\/apikeys\/?$/,
				names: ["project"],
				types: [null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/apikeys/_server.ts.js')
			},
			{
				id: "api/[project]/collections",
				pattern: /^\/api\/([^/]+?)\/collections\/?$/,
				names: ["project"],
				types: [null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/collections/_server.ts.js')
			},
			{
				id: "api/[project]/functions",
				pattern: /^\/api\/([^/]+?)\/functions\/?$/,
				names: ["project"],
				types: [null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/functions/_server.ts.js')
			},
			{
				id: "api/[project]/apikeys/[id]",
				pattern: /^\/api\/([^/]+?)\/apikeys\/([^/]+?)\/?$/,
				names: ["project","id"],
				types: [null,null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/apikeys/_id_/_server.ts.js')
			},
			{
				id: "api/[project]/collections/[collection]",
				pattern: /^\/api\/([^/]+?)\/collections\/([^/]+?)\/?$/,
				names: ["project","collection"],
				types: [null,null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/collections/_collection_/_server.ts.js')
			},
			{
				id: "api/[project]/functions/[id]",
				pattern: /^\/api\/([^/]+?)\/functions\/([^/]+?)\/?$/,
				names: ["project","id"],
				types: [null,null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/functions/_id_/_server.ts.js')
			},
			{
				id: "api/[project]/collections/[collection]/[id]",
				pattern: /^\/api\/([^/]+?)\/collections\/([^/]+?)\/([^/]+?)\/?$/,
				names: ["project","collection","id"],
				types: [null,null,null],
				page: null,
				endpoint: () => import('../output/server/entries/endpoints/api/_project_/collections/_collection_/_id_/_server.ts.js')
			},
			{
				id: "[project]",
				pattern: /^\/([^/]+?)\/?$/,
				names: ["project"],
				types: [null],
				page: { layouts: [0,2], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "[project]/collections",
				pattern: /^\/([^/]+?)\/collections\/?$/,
				names: ["project"],
				types: [null],
				page: { layouts: [0,2], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "[project]/settings",
				pattern: /^\/([^/]+?)\/settings\/?$/,
				names: ["project"],
				types: [null],
				page: { layouts: [0,2], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "[project]/collections/[name]",
				pattern: /^\/([^/]+?)\/collections\/([^/]+?)\/?$/,
				names: ["project","name"],
				types: [null,null],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "[project]/env/[name]",
				pattern: /^\/([^/]+?)\/env\/([^/]+?)\/?$/,
				names: ["project","name"],
				types: [null,null],
				page: { layouts: [0,2], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "[project]/functions/[name]",
				pattern: /^\/([^/]+?)\/functions\/([^/]+?)\/?$/,
				names: ["project","name"],
				types: [null,null],
				page: { layouts: [0,2,4], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "[project]/collections/[name]/edit",
				pattern: /^\/([^/]+?)\/collections\/([^/]+?)\/edit\/?$/,
				names: ["project","name"],
				types: [null,null],
				page: { layouts: [0,2,3], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "[project]/functions/[name]/edit",
				pattern: /^\/([^/]+?)\/functions\/([^/]+?)\/edit\/?$/,
				names: ["project","name"],
				types: [null,null],
				page: { layouts: [0,2,4], errors: [1,,,], leaf: 12 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
