export const unixSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);
export const timeSlotFor = (date = new Date(), windowSeconds = 900) => Math.floor(unixSeconds(date) / windowSeconds);
export const secondsUntilNextSlot = (date = new Date(), windowSeconds = 900) => windowSeconds - (unixSeconds(date) % windowSeconds);
export const isExpired = (expiresAt, now = Date.now()) => Number(expiresAt || 0) <= Math.floor(now / 1000);
