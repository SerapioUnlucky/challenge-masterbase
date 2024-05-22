const jwt = require('jsonwebtoken');
const secret = 'secret';

const createToken = (user) => {

    const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        iat: Date.now(),
        exp: Date.now() + 1000 * 60 * 60 * 24
    };

    return jwt.sign(payload, secret);

}

module.exports = {

    createToken

};