import { REAL_WORLD_REFERENCE } from './colegio-agv-shared.js';

export const SCHOOL_DIRECTORY = Object.freeze([
  { section: 'Frente', items: ['Entrada principal', 'Secretaria', 'Diretoria', 'Equipe pedagógica'] },
  { section: 'Ala pedagógica', items: ['Salas de aula', 'Sala dos professores', 'Biblioteca', 'Laboratório de informática'] },
  { section: 'Ala norte', items: ['Laboratório de Ciências', 'Sanitários'] },
  { section: 'Serviços', items: ['Cozinha', 'Refeitório', 'Bebedouro / apoio'] },
  { section: 'Convivência', items: ['Pátio central', 'Jardim frontal'] },
  { section: 'Esportes e eventos', items: ['Quadra esportiva', 'Auditório'] }
]);

export const INFO_CARDS = Object.freeze({
  'show-facade-info': {
    title: 'Identidade arquitetônica do AGV',
    body: 'A Fase 3 preserva os elementos visíveis nas fotografias públicas: fachada branca e azul, base azul, pilares inclinados em V, escadaria, rampa, janelas gradeadas, jardim e bancos azuis. A implantação interna continua aproximada.'
  },
  'show-school-numbers': {
    title: 'AGV em números',
    body: `Consulta oficial em 31/08/2026: ${REAL_WORLD_REFERENCE.liveSchoolPortalSnapshot.classes} turmas e ${REAL_WORLD_REFERENCE.liveSchoolPortalSnapshot.enrollments} matrículas. O Censo Escolar 2025 registra ${REAL_WORLD_REFERENCE.census2025Snapshot.enrollments} matrículas, ${REAL_WORLD_REFERENCE.census2025Snapshot.classes} turmas e ${REAL_WORLD_REFERENCE.census2025Snapshot.teachers} docentes.`
  },
  'show-accessibility': {
    title: 'Acessibilidade',
    body: 'As fontes públicas registram recursos de acessibilidade, incluindo rampas, corrimãos/guarda-corpos, portas com vão livre adequado e sinalização visual. No mapa, uma rota principal conecta portão, entrada e circulação pedagógica.'
  },
  'show-expansion-2026': {
    title: 'Ampliação CE 99/2026',
    body: 'O projeto prevê 1.785,11 m² de novas edificações, seis salas, quadra coberta, auditório, laboratório de Ciências, dois laboratórios de informática, sanitários e passarelas, além de adequações na biblioteca, cozinha e refeitório. Permanece como preview planejado enquanto a obra não estiver confirmada como concluída.'
  },
  'library-info': {
    title: 'Biblioteca / sala de leitura',
    body: 'Ambiente confirmado nas fontes de infraestrutura escolar. A posição e o mobiliário desta reconstrução continuam aproximados para gameplay.'
  }
});

export function resolveInteractionContent(interaction) {
  if (interaction === 'open-directory' || interaction === 'school-map') {
    return { title: 'Mapa da escola', sections: SCHOOL_DIRECTORY };
  }
  return INFO_CARDS[interaction] || null;
}
