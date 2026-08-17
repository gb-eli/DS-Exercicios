import { parentPort } from 'node:worker_threads';
const pending=[];
globalThis.postMessage=message=>parentPort.postMessage(message);
globalThis.self={onmessage:null};
parentPort.on('message',data=>{if(self.onmessage)self.onmessage({data});else pending.push(data);});
await import('../src/workers/station.worker.js');
for(const data of pending.splice(0))self.onmessage({data});
