
import type { FastifyInstance } from 'fastify';

import { getHealthCtrl } from './ctrl/get-health';
import { getImageCtrl } from './ctrl/image/get-image';
import { getErrorCtrl } from './ctrl/get-err';

export function addRoutes(app: FastifyInstance) {
  app.get('/health', getHealthCtrl);
  app.get('/err', getErrorCtrl);
  app.get('/v1/img/:imagePath', getImageCtrl);
}
