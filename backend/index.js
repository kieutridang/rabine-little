
// require new relic at the top only in production environment
// if (process.env.NODE_ENV === 'production') {
//   // require('newrelic')
// }

import { appPort } from '~/config';

import logger from 'utils/logger';

import server from './server';

const gracefulStopServer = () => {
  // Wait 10 secs for existing connection to close and then exit.
  server.stopServer();
};

process.on('uncaughtException', (err) => {
  logger.error(err, 'Uncaught exception');
  // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ promise, reason }, 'unhandledRejection');
  // process.exit(1);
});

process.on('SIGINT', gracefulStopServer);
process.on('SIGTERM', gracefulStopServer);

/**
 * Starts the server
 * @returns {promise.<void>}
 */
const startServer = async () => {
  try {
    // add things here before the app starts, like database connection check etc
    await server.startServer();
    logger.info(`server started at port: ${appPort}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

startServer();
