const bunyan = require('bunyan');

// create a logger instance
const log = bunyan.createLogger({
  name: 'Rabine Site',
  level: 'info',
  serializers: bunyan.stdSerializers
});

module.exports = log;
