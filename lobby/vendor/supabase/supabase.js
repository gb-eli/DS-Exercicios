/* AGV Lobby local SDK slot.
 * O build UMD pinado do Supabase pode substituir este arquivo no deploy.
 * Enquanto o bundle local não estiver incorporado, o vendor-loader detecta
 * ausência de createClient e usa as duas fontes CDN de contingência.
 */
globalThis.__AGV_SUPABASE_LOCAL_SLOT__ = true;
