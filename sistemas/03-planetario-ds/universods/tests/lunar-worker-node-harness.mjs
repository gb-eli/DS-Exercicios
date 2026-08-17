import { parentPort } from 'node:worker_threads';
const pending=[];
globalThis.self=globalThis;
globalThis.postMessage=message=>parentPort.postMessage(message);
parentPort.on('message',data=>{
  if(typeof globalThis.self.onmessage==='function')globalThis.self.onmessage({data});
  else pending.push(data);
});
await import('../src/workers/lunar.worker.js');
for(const data of pending.splice(0))globalThis.self.onmessage?.({data});
