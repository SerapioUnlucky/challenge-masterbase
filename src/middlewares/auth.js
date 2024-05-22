const jwt = require('jsonwebtoken');
const logger = require('../helpers/pino');
const secret = 'secret';

exports.auth = (req, res, next) => {

    if (!req.headers.authorization) {

        logger.error('No esta adjuntado el token de autorizacion en el header');
        return res.status(403).json({
            message: 'No tienes autorización'
        });

    }

    const token = req.headers.authorization.replace(/['"]+/g, '');

    try {

        const payload = jwt.verify(token, secret);

        if (payload.exp <= Date.now()) {

            logger.error('El token ha expirado');
            return res.status(403).json({
                message: 'El token ha expirado'
            });

        }

        next();

    } catch (error) {

        logger.error(error.message);
        return res.status(403).json({
            message: error.message
        });

    }

}