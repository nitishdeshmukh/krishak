import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id, expiresIn = process.env.JWT_EXPIRE) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn,
    });
};

export default generateToken;
