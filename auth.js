const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport.js'); // Import Passport configuration

/**
 * Generates a JWT token for the provided user.
 * @param {Object} user - The user object to be included in the token payload.
 * @returns {string} - The generated JWT token.
 */
let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d', // Token expiration time (7 days)
        algorithm: 'HS256' // HMAC SHA-256 algorithm for signing
    });
}

/**
 * Configures login endpoint for user authentication.
 * @param {Object} router - Express router object.
 */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}