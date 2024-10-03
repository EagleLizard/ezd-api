
import util from 'util';

export const Cmd = {
  parseArgv,
} as const;

function parseArgv(argv: string[]) {
  console.log('argv');
  console.log(argv);
  let pArgv = util.parseArgs({
    args: argv,
  });
  console.log('pArgv');
  console.log(pArgv);
}
