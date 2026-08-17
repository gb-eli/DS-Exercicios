import { SATELLITE_MISSIONS, SATELLITE_BUSES, SATELLITE_PAYLOADS, POWER_SYSTEMS, ANTENNAS } from '../../data/orbitalSystems.js';

const byId = (items, id) => items.find(item => item.id === id) ?? items[0];

export class SatelliteSystem {
  constructor(config = {}) {
    this.config = {
      missionId: config.missionId ?? 'observation',
      orbitId: config.orbitId ?? 'sso',
      busId: config.busId ?? 'cube-12u',
      payloadId: config.payloadId ?? 'camera-multispectral',
      powerId: config.powerId ?? 'deployable',
      antennaId: config.antennaId ?? 'medium-gain'
    };
  }

  update(patch = {}) {
    this.config = { ...this.config, ...patch };
    return this.summary();
  }

  summary() {
    const mission = byId(SATELLITE_MISSIONS, this.config.missionId);
    const bus = byId(SATELLITE_BUSES, this.config.busId);
    const payload = byId(SATELLITE_PAYLOADS, this.config.payloadId);
    const power = byId(POWER_SYSTEMS, this.config.powerId);
    const antenna = byId(ANTENNAS, this.config.antennaId);
    const totalMassKg = bus.massKg + payload.massKg + power.massKg + antenna.massKg;
    const peakLoadW = bus.baseLoadW + payload.loadW + antenna.loadW;
    const generationW = bus.basePowerW + power.generationW;
    const powerMarginW = generationW - peakLoadW;
    const dataMarginMbps = antenna.capacityMbps - payload.dataMbps;
    const eclipseEnduranceMinutes = bus.batteryWh / Math.max(1, peakLoadW) * 60;
    const validation = this.validate({ mission, bus, payload, antenna, totalMassKg, powerMarginW, dataMarginMbps, eclipseEnduranceMinutes });
    return { config:{ ...this.config }, mission, bus, payload, power, antenna, totalMassKg, peakLoadW, generationW, powerMarginW, dataMarginMbps, eclipseEnduranceMinutes, validation };
  }

  validate({ mission, bus, payload, antenna, totalMassKg, powerMarginW, dataMarginMbps, eclipseEnduranceMinutes }) {
    const issues = [];
    if (totalMassKg > bus.maxMassKg) issues.push(`Massa ${totalMassKg.toFixed(1)} kg excede o limite de ${bus.maxMassKg} kg do barramento.`);
    if (mission.requirements.payload && !mission.requirements.payload.includes(payload.id)) issues.push(`A carga ${payload.name} não atende ao objetivo principal da missão.`);
    if (mission.requirements.antenna && !mission.requirements.antenna.includes(antenna.id)) issues.push(`A missão requer antena de alto ganho.`);
    if (mission.requirements.orbit && !mission.requirements.orbit.includes(this.config.orbitId)) issues.push(`A órbita selecionada não é adequada ao perfil ${mission.name}.`);
    if (powerMarginW < mission.requirements.minPowerMargin) issues.push(`Margem de potência insuficiente: ${powerMarginW.toFixed(0)} W.`);
    if (dataMarginMbps < mission.requirements.minDataMargin) issues.push(`Capacidade de downlink insuficiente: margem ${dataMarginMbps.toFixed(0)} Mbps.`);
    if (eclipseEnduranceMinutes < 24) issues.push(`Autonomia em eclipse inferior a 24 minutos.`);
    return { ok: issues.length === 0, issues };
  }
}
