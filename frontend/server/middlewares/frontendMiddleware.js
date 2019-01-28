/* eslint-disable global-require */

/**
 * Front-end middleware
 */

const ENFORCE_SSL = process.env.ENFORCE_SSL === 'true';

module.exports = (app, options) => {
  const isProd = process.env.NODE_ENV === 'production';

  app.get('*', (req, res, next) => {
    if (ENFORCE_SSL && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }

    return next();
  });

  if (isProd) {
    const addProdMiddlewares = require('./addProdMiddlewares');
    addProdMiddlewares(app, options);
  } else {
    const webpackConfig = require('../../internals/webpack/webpack.dev.babel');
    const addDevMiddlewares = require('./addDevMiddlewares');
    addDevMiddlewares(app, webpackConfig);
  }

  return app;
};
