
import type { FastifyInstance } from 'fastify';

import { getHealthCtrl } from './ctrl/get-health';
import { getImageCtrl } from './ctrl/image/get-image';
import { getErrorCtrl } from './ctrl/get-err';

export function addRoutes(app: FastifyInstance) {
  app.get('/health', getHealthCtrl);
  app.get('/err', getErrorCtrl);

  app.get('/img/v1/*', getImageCtrl);

  // app.get('/jcd/v1/')

  // get('/health'
  // get('/'
  // get('/robots.txt'
  // get('/image/v0/:folder/:image?'
  // get('/image/v1/:folder/:image?'
  // get('/image/v2/:folder/:image?'
  // get('/jcd/v0/project/list'
  // get('/jcd/v0/project'
  // get('/jcd/v0/project/:projectRoute'
  // get('/jcd/v0/project/page/:projectKey'
  // get('/jcd/v1/project'
  // get('/jcd/v1/project/:projectRoute'
  // get('/jcd/v1/project/images/:projectKey'
}
