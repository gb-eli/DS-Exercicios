export const EARTH_RADIUS_KM = 6371;
export const EARTH_MU_KM3_S2 = 398600.4418;
export const EARTH_ROTATION_RAD_S = (Math.PI * 2) / 86164;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const normalizeDegrees = value => ((value + 540) % 360) - 180;

export class OrbitMath {
  static radiusKm(altitudeKm) {
    return EARTH_RADIUS_KM + Math.max(120, Number(altitudeKm) || 0);
  }

  static periodSeconds(altitudeKm) {
    const radius = this.radiusKm(altitudeKm);
    return Math.PI * 2 * Math.sqrt((radius ** 3) / EARTH_MU_KM3_S2);
  }

  static velocityKmS(altitudeKm) {
    return Math.sqrt(EARTH_MU_KM3_S2 / this.radiusKm(altitudeKm));
  }

  static horizonAngleRad(altitudeKm) {
    return Math.acos(EARTH_RADIUS_KM / this.radiusKm(altitudeKm));
  }

  static footprintRadiusKm(altitudeKm, minElevationDeg = 8) {
    const horizon = this.horizonAngleRad(altitudeKm);
    const reduction = clamp((Number(minElevationDeg) || 0) / 90, 0, .8);
    return EARTH_RADIUS_KM * horizon * (1 - reduction * .62);
  }

  static orbitalState({ altitudeKm = 550, inclinationDeg = 51.6, raanDeg = 0, elapsedSeconds = 0, phaseDeg = 0 } = {}) {
    const radius = this.radiusKm(altitudeKm);
    const inclination = inclinationDeg * Math.PI / 180;
    const raan = raanDeg * Math.PI / 180;
    const phase = phaseDeg * Math.PI / 180;
    const meanMotion = Math.sqrt(EARTH_MU_KM3_S2 / (radius ** 3));
    const theta = elapsedSeconds * meanMotion + phase;

    const xOrbital = radius * Math.cos(theta);
    const yOrbital = radius * Math.sin(theta);
    const xInclined = xOrbital;
    const yInclined = yOrbital * Math.cos(inclination);
    const zInclined = yOrbital * Math.sin(inclination);

    const x = xInclined * Math.cos(raan) - yInclined * Math.sin(raan);
    const y = xInclined * Math.sin(raan) + yInclined * Math.cos(raan);
    const z = zInclined;
    const earthRotation = EARTH_ROTATION_RAD_S * elapsedSeconds;
    const longitude = normalizeDegrees((Math.atan2(y, x) - earthRotation) * 180 / Math.PI);
    const latitude = Math.asin(clamp(z / radius, -1, 1)) * 180 / Math.PI;

    return {
      radiusKm: radius,
      xKm: x,
      yKm: y,
      zKm: z,
      latitudeDeg: latitude,
      longitudeDeg: longitude,
      anomalyRad: theta % (Math.PI * 2),
      periodSeconds: this.periodSeconds(altitudeKm),
      velocityKmS: this.velocityKmS(altitudeKm)
    };
  }

  static groundTrack(config = {}, samples = 96) {
    const period = this.periodSeconds(config.altitudeKm ?? 550);
    return Array.from({ length: Math.max(12, samples) }, (_, index) => {
      const elapsedSeconds = period * index / Math.max(1, samples - 1);
      const state = this.orbitalState({ ...config, elapsedSeconds });
      return { lat: state.latitudeDeg, lon: state.longitudeDeg, elapsedSeconds };
    });
  }

  static haversineKm(aLat, aLon, bLat, bLon) {
    const toRad = value => value * Math.PI / 180;
    const dLat = toRad(bLat - aLat);
    const dLon = toRad(bLon - aLon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
    return EARTH_RADIUS_KM * 2 * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  static formatPeriod(seconds) {
    const minutes = seconds / 60;
    if (minutes < 180) return `${minutes.toFixed(1)} min`;
    return `${(minutes / 60).toFixed(1)} h`;
  }
}
