import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} expiresIn - Token expiry time (e.g., '15m', '7d')
 * @param {string} secret - JWT secret key
 * @returns {string} JWT token
 */
const generateToken = (id, expiresIn, secret) => {
    return jwt.sign({ id }, secret, {
        expiresIn,
    });
};

export default generateToken;
