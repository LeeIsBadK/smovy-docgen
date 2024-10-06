export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.BHVQG00y.js","app":"_app/immutable/entry/app.BqcRSTmB.js","imports":["_app/immutable/entry/start.BHVQG00y.js","_app/immutable/chunks/entry.dh1c4MAn.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/entry/app.BqcRSTmB.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.zckE2Py4.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
