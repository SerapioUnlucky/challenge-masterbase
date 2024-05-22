const pino = require('pino')();

const pinoMiddleware = (req, res, next) => {

    pino.info({
        method: req.method,
        url: req.url,
    });

    next();

};

module.exports = pinoMiddleware