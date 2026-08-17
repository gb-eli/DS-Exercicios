import { parentPort } from 'node:worker_threads';
const pending=[];
globalThis.postMessage=message=>parentPort.postMessage(message);
globalThis.self=globalThis;
parentPort.on('message',data=>{
  if(typeof globalThis.self.onmessage==='function')globalThis.self.onmessage({data});
  else pending.push(data);
});
await import('../src/workers/mars.worker.js');
for(const data of pending.splice(0))globalThis.self.onmessage?.({data});
