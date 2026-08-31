import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const testFile=path.join(root,'core/tests/f63a-world-foundation-v14.10.8.65.test.mjs');
const result=spawnSync(process.execPath,['--test','--test-reporter=tap',testFile],{cwd:root,encoding:'utf8'});
process.stdout.write(result.stdout||'');
process.stderr.write(result.stderr||'');
if(result.error){console.error(result.error);process.exitCode=1;}
else process.exitCode=result.status??1;
