const RevokedToken = require('../models/RevokedToken');

async function checkTokenValidity(req, res, next) {
    const token = req.headers.authorization;
    const revokedToken = await RevokedToken.findOne({ token });

    if (revokedToken) {
        return res.status(401).json({ message: 'Token revoked. Please log in again.' });
    } else {
        next();
    }

}

module.exports = checkTokenValidity;