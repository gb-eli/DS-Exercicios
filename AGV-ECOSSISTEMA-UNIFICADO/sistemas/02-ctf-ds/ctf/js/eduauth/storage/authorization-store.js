const KEY = 'ctfds:eduauth:authorizations:v1';
const read = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || '{}'); } catch { return {}; } };
const write = (value) => sessionStorage.setItem(KEY, JSON.stringify(value));
export const storeAuthorization = (grant) => { const items = read(); items[grant.authorizationId] = grant; write(items); return grant; };
export const consumeAuthorization = (authorizationId) => { const items = read(); const grant = items[authorizationId]; if (!grant || grant.consumed || grant.expiresAt * 1000 <= Date.now()) return null; grant.consumed = true; grant.consumedAt = Date.now(); items[authorizationId] = grant; write(items); return grant; };
export const hasAuthorization = ({ actionId, resourceId = '', sessionIdTag = '' }) => Object.values(read()).some((grant) => !grant.consumed && grant.expiresAt * 1000 > Date.now() && grant.actionId === actionId && (!resourceId || grant.resourceId === resourceId) && (!sessionIdTag || grant.sessionIdTag === sessionIdTag));
export const markGrantIdConsumed = (grantId) => { const items = read(); items[`signed:${grantId}`] = { consumed: true, at: Date.now() }; write(items); };
export const isGrantIdConsumed = (grantId) => Boolean(read()[`signed:${grantId}`]?.consumed);
