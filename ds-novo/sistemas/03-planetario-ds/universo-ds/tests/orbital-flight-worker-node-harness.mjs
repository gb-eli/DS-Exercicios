import { parentPort } from 'node:worker_threads';
const pending=[];globalThis.postMessage=message=>parentPort.postMessage(message);globalThis.close=()=>{};globalThis.self=globalThis;
parentPort.on('message',data=>{if(typeof globalThis.onmessage==='function')globalThis.onmessage({data});else pending.push(data);});
await import('../src/workers/orbital-flight.worker.js');for(const data of pending.splice(0))globalThis.onmessage?.({data});
