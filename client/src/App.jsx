import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { routes } from './config/routes'
import { flattenRoutes } from './utils/routeUtils'
import PageLoader from './components/PageLoader'
import RouteLoader from './components/RouteLoader'

// Lazy load layout and login for better initial load
const AppLayout = lazy(() => import('./components/layout/AppLayout'))
const Login = lazy(() => import('./pages/Login'))

export default function App() {
  // Get all routes in flat array for easier mapping
  const allRoutes = flattenRoutes(routes)

  // Get parent routes that need redirects to their first child (only if they don't have a component themselves)
  const parentRoutesWithChildren = routes.filter(route => {
    const hasChildren = route.children && route.children.length > 0
    if (!hasChildren) return false

    // Check if this route or any sibling route definition for the same path has a component
    // This allows us to have a route act as both a parent (sidebar group) and a page (dashboard)
    const hasComponent = route.component || routes.some(r => r.path === route.path && r.component)

    return !hasComponent
  })

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      {/* Full PageLoader only for initial app/layout load */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Login page - no layout */}
          <Route path="/" element={<Login />} />

          {/* Authenticated routes with AppLayout */}
          <Route element={<AppLayout />}>
            {/* Redirects for parent nav items to their first child */}
            {parentRoutesWithChildren.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<Navigate to={route.children[0].path} replace />}
              />
            ))}

            {/* Declarative routes - map from config, excluding parent nav items without components */}
            {allRoutes
              .filter((route) => route.component) // Only render routes with components
              .map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Suspense fallback={<RouteLoader />}>
                      <route.component />
                    </Suspense>
                  }
                />
              ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
