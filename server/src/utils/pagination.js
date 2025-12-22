/**
 * Pagination utility for MongoDB queries
 */

/**
 * Build pagination parameters from query
 */
export const getPagination = (query) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || 10));
    const skip = (page - 1) * pageSize;

    return { page, pageSize, skip };
};

/**
 * Build pagination response
 */
export const buildPaginationResponse = (total, page, pageSize) => {
    const totalPages = Math.ceil(total / pageSize);

    return {
        totalPages,
        currentPage: page,
        pageSize,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prev: page > 1 ? page - 1 : null,
        next: page < totalPages ? page + 1 : null,
    };
};

/**
 * Build sort object from query params
 */
export const getSorting = (query, defaultSort = 'createdAt') => {
    const sortBy = query.sortBy || defaultSort;
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

    return { [sortBy]: sortOrder };
};

/**
 * Build filter object from query params
 */
export const getFilters = (query, allowedFields = []) => {
    const filters = {};

    Object.keys(query).forEach(key => {
        if (key.startsWith('filter[') && key.endsWith(']')) {
            const field = key.slice(7, -1);
            if (allowedFields.length === 0 || allowedFields.includes(field)) {
                filters[field] = { $regex: query[key], $options: 'i' };
            }
        }
    });

    return filters;
};
