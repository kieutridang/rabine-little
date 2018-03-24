
import auth from './auth';
import client from './client';
import dronePlan from './dronePlan';
import site from './site';

export default {
  ...auth,
  ...client,
  ...dronePlan,
  ...site,
};

