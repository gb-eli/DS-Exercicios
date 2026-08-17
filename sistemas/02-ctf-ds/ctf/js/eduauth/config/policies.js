export const EDUAUTH_POLICIES = {
  classWindowSeconds: 900,
  sessionWindowSeconds: 300,
  highRiskWindowSeconds: 180,
  allowedClockDriftSlots: 1,
  maximumAttempts: 5,
  progressiveDelayMs: [0, 750, 1500, 3000, 5000],
  requestCode: {
    prefix: 'EA1',
    encoding: 'BASE32_CROCKFORD',
    checksum: 'CRC32C',
    caseInsensitive: true,
    ignoreSeparators: true,
  },
};
