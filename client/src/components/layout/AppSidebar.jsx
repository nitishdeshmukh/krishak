"use client";

import React, { useCallback, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveView } from '@/store/slices/sidebarSlice';
import { routes } from '@/config/routes';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    UserIcon,
    BuildingOfficeIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateNavItems } from '@/utils/routeUtils';
import { cn } from '@/lib/utils';

const allNavItems = generateNavItems(routes);

export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation(['entry', 'common', 'reports']);

    // Get sidebar context for mobile close functionality
    const { isMobile, setOpenMobile } = useSidebar();

    const activeView = useSelector((state) => state.sidebar.activeView);

    useEffect(() => {

        const currentRoute = routes.find(route => {
            if (route.path === location.pathname) return true;
            const routePath = route.path.replace(/\/$/, '');
            return location.pathname.startsWith(routePath + '/');
        });

        if (currentRoute && currentRoute.view && currentRoute.view !== activeView) {
            dispatch(setActiveView(currentRoute.view));
        }
    }, [location.pathname, activeView, dispatch]);

    const handleToggleChange = useCallback((view) => {
        dispatch(setActiveView(view));
        if (view === 'reports') {
            navigate('/reports');
        } else {
            navigate('/entry');
        }
    }, [dispatch, navigate]);

    // Close sidebar on mobile when navigating - industry best practice
    const closeMobileSidebar = useCallback(() => {
        if (isMobile) {
            setOpenMobile(false);
        }
    }, [isMobile, setOpenMobile]);

    const renderMenuItem = useCallback((item) => {
        const isActive = location.pathname === item.url;
        const hasChildren = item.children && item.children.length > 0;
        const isChildActive = hasChildren && item.children.some(child => location.pathname === child.url);

        const displayTitle = item.titleKey ? t(item.titleKey) : item.title;

        if (hasChildren) {
            return (
                <Collapsible key={item.title} defaultOpen={isChildActive} className="group/collapsible">
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={displayTitle} isActive={isActive || isChildActive}>
                                {item.icon && <item.icon className="size-4" />}
                                <span>{displayTitle}</span>
                                <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                {item.children.map((child) => {
                                    const isChildItemActive = location.pathname === child.url;
                                    const childDisplayTitle = child.titleKey ? t(child.titleKey) : child.title;
                                    return (
                                        <SidebarMenuSubItem key={child.title}>
                                            <SidebarMenuSubButton asChild isActive={isChildItemActive}>
                                                <Link to={child.url} onClick={closeMobileSidebar}>
                                                    <span>{childDisplayTitle}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    );
                                })}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={displayTitle}>
                    <Link to={item.url}>
                        {item.icon && <item.icon className="size-4" />}
                        <span>{displayTitle}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }, [location.pathname, t, closeMobileSidebar]);

    // Filter menu items based on active view from Redux
    const getMenuItems = () => {
        return allNavItems.filter(item => {
            // Find the route to check its view property
            const route = routes.find(r => r.path === item.url);
            return route && route.view === activeView;
        });
    };

    return (
        <Sidebar>
            {/* Sidebar Header - Company Branding */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <BuildingOfficeIcon className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Krishak</span>
                                    <span className="text-xs text-muted-foreground">Enterprise</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Entry/Reports Toggle - Enhanced UI */}
                    <SidebarMenuItem>
                        <div className="p-2">
                            <Tabs value={activeView} onValueChange={(val) => {
                                handleToggleChange(val);
                                closeMobileSidebar();
                            }} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-sidebar-accent/50 h-auto p-1">
                                    <TabsTrigger
                                        value="entry"
                                        className="py-2 data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground shadow-none data-[state=active]:shadow-md transition-all"
                                    >
                                        {t('entry:dashboard.entry')}
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="reports"
                                        className="py-2 data-[state=active]:bg-sidebar-primary data-[state=active]:text-sidebar-primary-foreground shadow-none data-[state=active]:shadow-md transition-all"
                                    >
                                        {t('entry:dashboard.reports')}
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Sidebar Content - Navigation */}
            < SidebarContent >
                <SidebarMenu>
                    {getMenuItems().map(renderMenuItem)}
                </SidebarMenu>
            </SidebarContent >

            {/* Sidebar Footer - User Profile with Settings */}
            < SidebarFooter >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div className="flex items-center gap-2 cursor-default">
                                <Link to="/profile" onClick={closeMobileSidebar} className="flex items-center gap-2 flex-1">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                                        <UserIcon className="size-4" />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-0.5 leading-none text-left">
                                        <span className="font-semibold text-sm">User Name</span>
                                        <span className="text-xs text-muted-foreground">user@example.com</span>
                                    </div>
                                </Link>
                                <Link to="/settings" onClick={closeMobileSidebar} className="ml-auto p-1 rounded hover:bg-muted transition-colors">
                                    <Cog6ToothIcon className="size-5 text-muted-foreground hover:text-foreground transition-colors" />
                                </Link>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter >
        </Sidebar >
    );
}
