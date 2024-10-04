import { Hono } from 'hono';

import { getHealthCtrl } from './ctrl/get-health';
import { getErrorCtrl } from './ctrl/get-err';
import { getImageCtrl } from './ctrl/image/get-image';

export function addHRoutes(app: Hono) {
  app.get('/v1/health', getHealthCtrl);
  app.get('/v1/err', getErrorCtrl);

  app.get('/v1/img/:imagePath', getImageCtrl);
}
