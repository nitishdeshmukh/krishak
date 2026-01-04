/**
 * Parse time string to milliseconds
 * @param {string} timeStr - Time string (e.g., '15m', '7d', '1h')
 * @returns {number} Time in milliseconds
 */
const parseExpiry = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') {
        throw new Error('Invalid time string');
    }

    const units = {
        s: 1000,           // seconds
        m: 60 * 1000,      // minutes
        h: 60 * 60 * 1000, // hours
        d: 24 * 60 * 60 * 1000, // days
    };

    const match = timeStr.match(/^(\d+)([smhd])$/);

    if (!match) {
        throw new Error(`Invalid time format: ${timeStr}. Use format like '15m', '7d', '1h'`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    return value * units[unit];
};

export default parseExpiry;
