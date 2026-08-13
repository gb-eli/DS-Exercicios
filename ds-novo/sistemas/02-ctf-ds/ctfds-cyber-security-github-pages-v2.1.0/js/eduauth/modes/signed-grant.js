import { canonicalEncode, decodeUtf8 } from '../core/canonical-encoder.js';
import { base64UrlDecode } from '../core/random.js';
import { EDUAUTH_KEY_CONFIG } from '../config/key-config.js';
import { isGrantIdConsumed, markGrantIdConsumed } from '../storage/authorization-store.js';
import { recordEduAuthEvent } from '../storage/audit-log.js';

export const verifySignedGrant = async (token, expected = {}, { now = Math.floor(Date.now() / 1000), consume = true } = {}) => {
  try {
    const parts = String(token || '').trim().split('.');
    if (parts.length !== 3 || parts[0] !== 'EA1-G1') throw new Error('Token assinado incompatível.');
    const payloadBytes = base64UrlDecode(parts[1]); const signature = base64UrlDecode(parts[2]);
    const payload = JSON.parse(decodeUtf8(payloadBytes));
    const publicKey = await crypto.subtle.importKey('jwk', EDUAUTH_KEY_CONFIG.signingPublicKey.jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    const validSignature = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, publicKey, signature, canonicalEncode(payload));
    if (!validSignature) throw new Error('Assinatura inválida.');
    if (payload.protocol !== 'EDUAUTH' || payload.version !== 1 || payload.platformId !== 'ctfds') throw new Error('Escopo da autorização incompatível.');
    if (payload.expiresAt <= now || payload.issuedAt > now + 60) throw new Error('Autorização expirada ou com horário incompatível.');
    for (const [key, value] of Object.entries(expected)) if (value && payload[key] !== value) throw new Error(`Autorização não pertence ao recurso solicitado (${key}).`);
    if (isGrantIdConsumed(payload.grantId)) throw new Error('Autorização já utilizada.');
    if (consume && payload.singleUse !== false) markGrantIdConsumed(payload.grantId);
    await recordEduAuthEvent({ platform: 'ctfds', mode: 'SIGNED_GRANT', risk: payload.risk || 'CRITICAL', result: 'granted', actionId: payload.actionId, requestId: payload.requestIdTag || '', sessionId: payload.sessionIdTag || '', consumed: consume });
    return { valid: true, payload };
  } catch (error) {
    await recordEduAuthEvent({ platform: 'ctfds', mode: 'SIGNED_GRANT', result: 'denied', reason: error.message });
    return { valid: false, error: error.message };
  }
};
