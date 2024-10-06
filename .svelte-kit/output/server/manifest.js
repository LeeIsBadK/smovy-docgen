export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["documents/form4231.pdf","favicon.png","fonts/THSarabunNew/THSarabunNew Bold.ttf","fonts/THSarabunNew/THSarabunNew BoldItalic.ttf","fonts/THSarabunNew/THSarabunNew Italic.ttf","fonts/THSarabunNew/THSarabunNew.ttf"]),
	mimeTypes: {".pdf":"application/pdf",".png":"image/png",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.ZL2UWVxY.js","app":"_app/immutable/entry/app.2QT0Hy7t.js","imports":["_app/immutable/entry/start.ZL2UWVxY.js","_app/immutable/chunks/entry.FR6Gn_-G.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.2QT0Hy7t.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.zckE2Py4.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/taxi",
				pattern: /^\/api\/taxi\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/taxi/_server.ts.js'))
			},
			{
				id: "/taxi",
				pattern: /^\/taxi\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
