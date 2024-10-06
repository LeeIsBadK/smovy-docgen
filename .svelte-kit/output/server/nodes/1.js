

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.i0-Su2go.js","_app/immutable/chunks/scheduler.BvLojk_z.js","_app/immutable/chunks/index.zckE2Py4.js","_app/immutable/chunks/entry.dh1c4MAn.js"];
export const stylesheets = [];
export const fonts = [];
