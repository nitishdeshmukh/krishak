import React from 'react';
import { Route } from 'react-router-dom';

/**
 * Generate React Router Route components from route config
 * @param {Array} routes - Route configuration array
 * @returns {Array} Array of Route components
 */
export const generateRoutes = (routes) => {
    const routeElements = [];

    routes.forEach((route) => {
        // Add parent route
        routeElements.push(
            React.createElement(Route, {
                key: route.path,
                path: route.path,
                element: React.createElement(route.component),
            })
        );

        // Add child routes if any
        if (route.children && route.children.length > 0) {
            route.children.forEach((child) => {
                routeElements.push(
                    React.createElement(Route, {
                        key: child.path,
                        path: child.path,
                        element: React.createElement(child.component),
                    })
                );
            });
        }
    });

    return routeElements;
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
            titleKey: route.titleKey, // Pass titleKey for translation
            url: route.path,
            icon: route.icon,
            children: route.children
                ? route.children
                    .filter((child) => child.showInSidebar)
                    .map((child) => ({
                        title: child.title,
                        titleKey: child.titleKey, // Pass titleKey for translation
                        url: child.path,
                    }))
                : undefined,
        }));
};

/**
 * Build breadcrumb trail for current path
 * @param {string} pathname - Current pathname
 * @param {Array} routes - Route configuration array
 * @returns {Array} Breadcrumb labels
 */
export const generateBreadcrumbs = (pathname, routes) => {
    const breadcrumbs = ['Dashboard'];

    // Find matching route
    for (const route of routes) {
        if (route.path === pathname && route.path !== '/') {
            breadcrumbs.push(route.title);
            break;
        }

        // Check children
        if (route.children) {
            for (const child of route.children) {
                if (child.path === pathname) {
                    breadcrumbs.push(route.title);
                    breadcrumbs.push(child.title);
                    return breadcrumbs;
                }
            }
        }
    }

    return breadcrumbs;
};

/**
 * Get all routes (including children) as flat array for routing
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
