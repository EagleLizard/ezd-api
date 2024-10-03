
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

// import { initServer } from './koa/server';
// import { Cmd } from './lib/cmd/cmd';
import { initServer } from './server';

(async () => {
  try {
    await main();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function main() {

  /*
    very simple args for now
   */

  let arg1: string;
  arg1 = process.argv[2];
  switch(arg1) {
    case undefined:
    case 'h':
      // hono
      await initServer();
      break;
    default:
      throw new Error(`Invalid arg1: ${arg1}`);
  }

  setProcName();
}

function setProcName() {
  process.title = 'ezd-api';
}

