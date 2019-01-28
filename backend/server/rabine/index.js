const routes = require('./routes');

exports.register = (server, opts, next) => {
  server.route(routes);
  return next();
};

exports.register.attributes = {
  name: 'Rabine Site'
};
