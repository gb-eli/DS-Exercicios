const projectRoot = new URL('../../../', import.meta.url);

const unique = values => [...new Set(values.filter(Boolean))];
const isAbsolute = value => /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(String(value || ''));
const cleanProjectPath = value => String(value || '').replace(/^\.\//, '').replace(/^\//, '');

function safeUrl(value, base) {
  try { return new URL(value, base).href; } catch { return null; }
}

export function resourceCandidates(value, { baseUrl = null } = {}) {
  const raw = String(value || '').trim();
  if (!raw) return [];
  const candidates = [];
  if (isAbsolute(raw)) candidates.push(safeUrl(raw, baseUrl || projectRoot));
  const projectPath = cleanProjectPath(raw);
  if (/^public\//.test(projectPath)) candidates.push(safeUrl(projectPath, projectRoot));
  if (baseUrl && !/^public\//.test(projectPath)) candidates.push(safeUrl(raw, baseUrl));
  candidates.push(safeUrl(projectPath, projectRoot));
  if (typeof document !== 'undefined') {
    candidates.push(safeUrl(raw, document.baseURI));
    candidates.push(safeUrl(projectPath, new URL('./', document.baseURI)));
  }
  if (typeof location !== 'undefined') candidates.push(safeUrl(raw, location.href));
  return unique(candidates);
}

async function readFetch(url, type) {
  if (typeof fetch !== 'function') throw new Error('Fetch indisponível.');
  const response = await fetch(url, { cache: 'force-cache', credentials: 'same-origin' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  if (type === 'json') return response.json();
  if (type === 'text') return response.text();
  if (type === 'blob') return response.blob();
  return response.arrayBuffer();
}

function readXhr(url, type) {
  return new Promise((resolve, reject) => {
    if (typeof XMLHttpRequest === 'undefined') return reject(new Error('XHR indisponível.'));
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = type === 'json' || type === 'text' ? 'text' : type;
    xhr.onload = () => {
      const ok = (xhr.status >= 200 && xhr.status < 300) || (xhr.status === 0 && xhr.response != null);
      if (!ok) return reject(new Error(`XHR ${xhr.status || 'local'} sem conteúdo.`));
      try {
        if (type === 'json') return resolve(JSON.parse(xhr.responseText));
        if (type === 'text') return resolve(xhr.responseText);
        resolve(xhr.response);
      } catch (error) { reject(error); }
    };
    xhr.onerror = () => reject(new Error('XHR não conseguiu abrir o recurso local.'));
    xhr.onabort = () => reject(new Error('XHR cancelado.'));
    try { xhr.send(); } catch (error) { reject(error); }
  });
}

async function readCache(url, type) {
  if (typeof caches === 'undefined') throw new Error('Cache API indisponível.');
  const response = await caches.match(url);
  if (!response) throw new Error('Recurso não encontrado no cache.');
  if (type === 'json') return response.json();
  if (type === 'text') return response.text();
  if (type === 'blob') return response.blob();
  return response.arrayBuffer();
}

export async function loadResource(value, { type = 'arrayBuffer', baseUrl = null } = {}) {
  const attempts = [];
  for (const url of resourceCandidates(value, { baseUrl })) {
    for (const strategy of [readCache, readFetch, readXhr]) {
      try { return { data: await strategy(url, type), url, strategy: strategy.name }; }
      catch (error) { attempts.push(`${strategy.name}:${url}:${error.message}`); }
    }
  }
  const error = new Error('Recurso gráfico indisponível nesta prévia.');
  error.code = 'COSMOS_RESOURCE_UNAVAILABLE';
  error.attempts = attempts;
  throw error;
}

export const projectBaseUrl = projectRoot.href;
