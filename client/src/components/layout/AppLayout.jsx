import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setActiveView } from '@/store/slices/sidebarSlice';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import AppSidebar from './AppSidebar';
import LanguageToggle from '../LanguageToggle';
import { routes } from '@/config/routes';

export default function AppLayout({ children }) {
    const location = useLocation();
    const { t } = useTranslation(['entry', 'common', 'reports']);
    const dispatch = useDispatch();

    // Sync Redux state with current route on navigation
    useEffect(() => {
        if (location.pathname.startsWith('/reports')) {
            dispatch(setActiveView('reports'));
        } else {
            dispatch(setActiveView('entry'));
        }
    }, [location.pathname, dispatch]);

    // Function to get translated breadcrumbs
    const getBreadcrumbs = () => {
        const breadcrumbs = [];

        // Add dashboard breadcrumb based on current view
        if (location.pathname.startsWith('/reports')) {
            breadcrumbs.push({ label: t('entry:dashboard.reports'), path: '/reports' });
        } else {
            breadcrumbs.push({ label: t('entry:dashboard.entry'), path: '/' });
        }

        // Skip if we're on a dashboard root
        if (location.pathname === '/' || location.pathname === '/reports') {
            return breadcrumbs;
        }

        // Find matching route for breadcrumbs
        for (const route of routes) {
            if (route.path === location.pathname && route.titleKey) {
                const label = t(route.titleKey);
                breadcrumbs.push({ label, path: route.path });
                return breadcrumbs;
            }

            // Check children
            if (route.children) {
                for (const child of route.children) {
                    if (child.path === location.pathname && child.titleKey) {
                        // Add parent
                        if (route.titleKey) {
                            breadcrumbs.push({ label: t(route.titleKey), path: route.path });
                        }
                        // Add child
                        breadcrumbs.push({ label: t(child.titleKey), path: child.path });
                        return breadcrumbs;
                    }
                }
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header with breadcrumbs */}
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />

                    {/* Auto-generated Breadcrumbs */}
                    <Breadcrumb>
                        <BreadcrumbList>
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                                        {index === breadcrumbs.length - 1 ? (
                                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>

                    {/* Language Toggle - Right side */}
                    <div className="ml-auto">
                        <LanguageToggle />
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
