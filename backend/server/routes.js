/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import flattenDeep from 'lodash/flattenDeep';
import * as otherRoutes from '~/routes';

// add ping route by default for health check
const routes = [{
  method: 'GET',
  path: '/ping',
  handler: (request, reply) => {
    return reply('pong');
  },
  config: {
    tags: ['api'],
    auth: 'token'
  }
}];

// add all routes from all modules to the routes array manually
// or write your routes inside a folder inside the server folder
// with suffix as Routes.js e.g weatherRoutes.js
Object.keys(otherRoutes).forEach((key) => {
  const route = otherRoutes[key];
  routes.push(route);
});

// export routes
module.exports = flattenDeep(routes);
