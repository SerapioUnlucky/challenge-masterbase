const pino = require('pino');

const logger = pino({
    level: 'trace'
});

module.exports = logger;