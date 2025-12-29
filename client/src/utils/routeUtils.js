import React from 'react';
import { Route } from 'react-router-dom';

/**
 * Find route by path (including children)
 * Single source of truth for route lookups
 * @param {Array} routes - Route configuration array
 * @param {string} pathname - Path to search for
 * @returns {Object|null} Route object or {parent, route} for child routes
 */
export const findRouteByPath = (routes, pathname) => {
    for (const route of routes) {
        if (route.path === pathname) {
            return route;
        }

        // Check children
        if (route.children) {
            const child = route.children.find(c => c.path === pathname);
            if (child) {
                return { parent: route, route: child };
            }
        }
    }
    return null;
};

/**
 * Generate breadcrumbs for current path
 * Shows navigation hierarchy without view type duplication
 * Example: "Entry > Add Mill Staff" (not "Entry > Entry > Add Mill Staff")
 * @param {string} pathname - Current pathname
 * @param {Array} routes - Route configuration array
 * @param {Function} t - Translation function
 * @returns {Array} Breadcrumb array with label and path
 */
export const getBreadcrumbs = (pathname, routes, t) => {
    const breadcrumbs = [];
    const found = findRouteByPath(routes, pathname);

    // Utility routes (UI Guide) - standalone
    if (found?.route?.view === 'utility' || found?.view === 'utility') {
        const route = found.route || found;
        if (route.titleKey) {
            breadcrumbs.push({
                label: t(route.titleKey),
                path: route.path
            });
        }
        return breadcrumbs;
    }

    // Dashboard roots - return empty (no breadcrumbs needed)
    if (pathname === '/' || pathname === '/entry' || pathname === '/reports') {
        return breadcrumbs;
    }

    // Add navigation hierarchy breadcrumbs
    if (found) {
        const route = found.route || found;
        const parentRoute = found.parent;

        // Add parent breadcrumb (nav item like "Entry", "Purchase Deals", etc.)
        if (parentRoute && parentRoute.titleKey) {
            breadcrumbs.push({
                label: t(parentRoute.titleKey),
                path: parentRoute.path
            });
        }

        // Add current page
        if (route.titleKey) {
            breadcrumbs.push({
                label: t(route.titleKey),
                path: route.path
            });
        }
    }

    return breadcrumbs;
};

/**
 * Generate navigation items for sidebar from route config
 * @param {Array} routes - Route configuration array
 * @returns {Array} Navigation items array
 */
export const generateNavItems = (routes) => {
    return routes
        .filter((route) => route.showInSidebar)
        .map((route) => ({
            title: route.title,
            titleKey: route.titleKey,
            url: route.path,
            icon: route.icon,
            children: route.children
                ? route.children
                    .filter((child) => child.showInSidebar)
                    .map((child) => ({
                        title: child.title,
                        titleKey: child.titleKey,
                        url: child.path,
                    }))
                : undefined,
        }));
};

/**
 * Get all routes (including children) as flat array
 * @param {Array} routes - Route configuration array
 * @returns {Array} Flat array of all routes
 */
export const flattenRoutes = (routes) => {
    const flat = [];
    routes.forEach((route) => {
        flat.push(route);
        if (route.children) {
            flat.push(...route.children);
        }
    });
    return flat;
};
