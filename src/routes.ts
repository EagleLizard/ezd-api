
import type { FastifyInstance } from 'fastify';

import { getHealthCtrl } from './ctrl/get-health';
import { getImageCtrl } from './ctrl/image/get-image';
import { getErrorCtrl } from './ctrl/get-err';
import { getJcdProjectsCtrl } from './ctrl/project/get-jcd-projects';
import { getJcdProjectCtrl } from './ctrl/project/get-jcd-project';
import { getJcdProjectImagesCtrl } from './ctrl/project/get-jcd-project-images';

export function addRoutes(app: FastifyInstance) {

  /*
    see: https://github.com/fastify/help/issues/74
  _*/
  // app.get()

  // app.setNotFoundHandler((req, res) => {
  //   console.log(req.url);
  //   console.log(req.method);
  //   console.log(req.raw.url);
  //   return res.status(404).send();
  // });

  app.get('/health', getHealthCtrl);
  app.get('/err', getErrorCtrl);

  app.get('/img/v1/*', getImageCtrl);

  app.get('/jcd/v1/project', getJcdProjectsCtrl);
  app.get('/jcd/v1/project/:projectRoute', getJcdProjectCtrl);
  app.get('/jcd/v1/project/images/:projectKey', getJcdProjectImagesCtrl);

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
