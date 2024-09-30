
import KoaRouter from '@koa/router';
import { getHealthCtrl } from './ctrl/get-health';

export function addRoutes(router: KoaRouter): KoaRouter {
  router = router.get('/v1/health', getHealthCtrl);
  return router;
}
