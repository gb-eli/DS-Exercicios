import { ImagePipeline } from '../core/observatory/ImagePipeline.js';
let pipeline=new ImagePipeline({size:48});let quality='balanced';
const sizeByQuality={performance:32,balanced:48,experience:64,automatic:48};
self.onmessage=event=>{const {type,payload={}}=event.data??{};if(type==='quality'){quality=payload.quality??'balanced';pipeline=new ImagePipeline({size:sizeByQuality[quality]??48});postMessage({type:'ready',payload:{quality,size:pipeline.size}});}if(type==='process'){const started=performance.now();const frame=pipeline.generate(payload);postMessage({type:'frame',payload:{...frame,processingMs:Number((performance.now()-started).toFixed(2)),quality}});}if(type==='ping')postMessage({type:'pong',payload:{quality,size:pipeline.size}});};
