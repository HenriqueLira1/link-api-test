import { Router } from 'express';

import DealController from './app/controllers/DealController';

const routes = new Router();

routes.get('/deals', DealController.index);

export default routes;
