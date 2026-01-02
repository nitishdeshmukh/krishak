/**
 * Shared utility for generating sequential purchase/document numbers
 * Format: PREFIX-DDMMYY-N (e.g., RP-291224-1, FP-291224-3)
 * 
 * @param {mongoose.Model} Model - The Mongoose model to query
 * @param {string} field - The field name containing the number
 * @param {string} prefix - The prefix for the number (e.g., 'RP', 'FP')
 * @returns {Promise<string>} - The generated number
 */
export const generateSequentialNumber = async (Model, field, prefix) => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const dateStr = `${day}${month}${year}`;
    const fullPrefix = `${prefix}-${dateStr}-`;

    // Find the last record with this prefix, sorted by the number field descending
    const lastRecord = await Model.findOne({
        [field]: { $regex: `^${fullPrefix}` }
    }).sort({ [field]: -1 });

    let counter = 1;
    if (lastRecord && lastRecord[field]) {
        const parts = lastRecord[field].split('-');
        const lastCounter = parseInt(parts[2], 10);
        if (!isNaN(lastCounter)) {
            counter = lastCounter + 1;
        }
    }

    return `${fullPrefix}${counter}`;
};

/**
 * Creates a pre-save middleware for auto-generating sequential numbers
 * 
 * @param {string} field - The field name to generate
 * @param {string} prefix - The prefix for the number
 * @returns {Function} - Mongoose pre-save middleware function
 */
export const createNumberGeneratorMiddleware = (field, prefix) => {
    return async function () {
        // Only generate if field is not already set
        if (this[field]) {
            return;
        }

        this[field] = await generateSequentialNumber(this.constructor, field, prefix);
    };
};

/**
 * Generate labor numbers for different labor types
 */
export const generateLaborNumber = async (type) => {
    const InwardLabor = (await import('../models/laborCost/InwardLabor.js')).default;
    const OutwardLabor = (await import('../models/laborCost/OutwardLabor.js')).default;
    const MillingLabor = (await import('../models/laborCost/MillingLabor.js')).default;
    const OtherLabor = (await import('../models/laborCost/OtherLabor.js')).default;

    const prefixMap = {
        'INWARD_LABOR': { model: InwardLabor, prefix: 'IWL' },
        'OUTWARD_LABOR': { model: OutwardLabor, prefix: 'OWL' },
        'MILLING_LABOR': { model: MillingLabor, prefix: 'MIL' },
        'OTHER_LABOR': { model: OtherLabor, prefix: 'OTL' },
    };

    const config = prefixMap[type];
    if (!config) {
        throw new Error(`Unknown labor type: ${type}`);
    }

    return await generateSequentialNumber(config.model, 'laborNumber', config.prefix);
};

export default { generateSequentialNumber, createNumberGeneratorMiddleware };
