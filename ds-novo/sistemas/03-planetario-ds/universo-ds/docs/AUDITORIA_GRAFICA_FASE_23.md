# Auditoria gráfica final

Foram auditados 20 renderizadores. Os critérios incluem:

- resize e fullscreen;
- cancelamento de RAF;
- descarte de programas, VAOs, buffers e texturas;
- fallback Canvas 2D;
- qualidade adaptativa;
- redução de movimento;
- câmera 360° e 6DOF;
- partículas contextuais;
- HDR/PBR, exposição e pós-processamento;
- interfaces que preservam a área central da cena.

## Melhorias transversais

- interiores e hotspots mantêm o procedural como fallback;
- áudio mecânico é sintetizado por Web Audio, sem arquivos externos obrigatórios;
- resolução dinâmica é reduzida sob sobrecarga;
- pacotes Leve, Equilibrado e Premium possuem orçamentos explícitos;
- campanhas não mantêm workers ou cenas anteriores em memória.
