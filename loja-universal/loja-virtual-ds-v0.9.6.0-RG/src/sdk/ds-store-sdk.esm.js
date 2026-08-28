const sdk = globalThis.DSStoreSDK;
if (!sdk) throw new Error('Carregue dist/ds-store-sdk.js antes do módulo ESM.');
export const { VERSION, PROTOCOL, RESPONSE_PROTOCOL, EVENT_METHODS, SDKClient, StoreBridge, create, createAdapter, startBridge } = sdk;
export default sdk;
