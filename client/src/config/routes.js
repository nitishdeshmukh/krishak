import Home from '@/pages/Home';
import UIGuide from '@/pages/UIGuide';
import StudentEnrollments from '@/pages/StudentEnrollments';
import Entry from '@/pages/Entry';
import Reports from '@/pages/Reports';
import {
    HomeIcon,
    UsersIcon,
    PaintBrushIcon,
    Cog6ToothIcon,
    UserIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    ArrowDownTrayIcon,
    UserGroupIcon,
    TruckIcon,
    BuildingOfficeIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

/**
 * Centralized route configuration
 * Automatically syncs across App.jsx, AppSidebar.jsx, and AppLayout.jsx
 */
export const routes = [
    // ===== ENTRY VIEW ROUTES =====
    {
        path: '/',
        component: Entry,
        title: 'Entry',
        titleKey: 'entry:nav.entry',
        icon: DocumentTextIcon,
        showInSidebar: false,
        view: 'entry', // Which view this belongs to
    },
    {
        path: '/demo',
        component: Reports,
        title: 'Entry',
        titleKey: 'entry:nav.entry',
        icon: DocumentTextIcon,
        showInSidebar: false,
        view: 'entry', // Which view this belongs to
    },
    {
        path: '/entry',
        component: Entry,
        title: 'Entry',
        titleKey: 'entry:sections.entry.title',
        icon: DocumentTextIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/entry/party',
                component: Home,
                title: 'Add Party',
                titleKey: 'entry:sections.entry.addParty',
                showInSidebar: true,
            },
            {
                path: '/entry/transporters',
                component: Home,
                title: 'Add Transporters',
                titleKey: 'entry:sections.entry.addTransporters',
                showInSidebar: true,
            },
            {
                path: '/entry/brokers',
                component: Home,
                title: 'Add Brokers',
                titleKey: 'entry:sections.entry.addBrokers',
                showInSidebar: true,
            },
            {
                path: '/entry/committee',
                component: Home,
                title: 'Add Committee Structure',
                titleKey: 'entry:sections.entry.addCommittee',
                showInSidebar: true,
            },
            {
                path: '/entry/do',
                component: Home,
                title: 'DO Entry',
                titleKey: 'entry:sections.entry.doEntry',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/purchase',
        component: Home,
        title: 'Purchase Deals',
        titleKey: 'entry:sections.purchase.title',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/purchase/paddy',
                component: Home,
                title: 'Paddy Purchase Deal',
                titleKey: 'entry:sections.purchase.paddy',
                showInSidebar: true,
            },
            {
                path: '/purchase/rice',
                component: Home,
                title: 'Rice Purchase Deal',
                titleKey: 'entry:sections.purchase.rice',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/sales',
        component: Home,
        title: 'Sales Deals',
        titleKey: 'entry:sections.sales.title',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/sales/paddy',
                component: Home,
                title: 'Paddy Deals',
                titleKey: 'entry:sections.sales.paddy',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/inward',
        component: Home,
        title: 'Inward',
        titleKey: 'entry:sections.inward.title',
        icon: ArrowDownTrayIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/inward/govt-paddy',
                component: Home,
                title: 'Government Paddy Inward',
                titleKey: 'entry:sections.inward.govtPaddy',
                showInSidebar: true,
            },
            {
                path: '/inward/private-paddy',
                component: Home,
                title: 'Private Paddy Inward',
                titleKey: 'entry:sections.inward.privatePaddy',
                showInSidebar: true,
            },
            {
                path: '/inward/rice',
                component: Home,
                title: 'Rice Inward / Lot Deposit',
                titleKey: 'entry:sections.inward.rice',
                showInSidebar: true,
            },
        ],
    },

    // ===== REPORTS VIEW ROUTES =====
    {
        path: '/reports',
        component: Reports,
        title: 'Reports',
        titleKey: 'entry:nav.reports',
        icon: DocumentTextIcon,
        showInSidebar: false,
        view: 'reports',
    },
    {
        path: '/reports/entry',
        component: Reports,
        title: 'Entry Report',
        titleKey: 'reports:sections.entry.title',
        icon: DocumentTextIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/entry/party-info',
                component: Reports,
                title: 'Information of Party',
                titleKey: 'reports:sections.entry.partyInfo',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/transporters',
                component: Reports,
                title: 'Transporters',
                titleKey: 'reports:sections.entry.transporters',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/brokers',
                component: Reports,
                title: 'Brokers',
                titleKey: 'reports:sections.entry.brokers',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/committee',
                component: Reports,
                title: 'Committee Structure',
                titleKey: 'reports:sections.entry.committee',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/do',
                component: Reports,
                title: 'DO Entry Report',
                titleKey: 'reports:sections.entry.doReport',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/remaining-do',
                component: Reports,
                title: 'Details of Remaining DO Lifting',
                titleKey: 'reports:sections.entry.remainingDO',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/purchase',
        component: Reports,
        title: 'Purchase Deals Report',
        titleKey: 'reports:sections.purchase.title',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/purchase/paddy',
                component: Reports,
                title: 'Paddy Purchase Deal Report',
                titleKey: 'reports:sections.purchase.paddy',
                showInSidebar: true,
            },
            {
                path: '/reports/purchase/rice',
                component: Reports,
                title: 'Rice Purchase Deal Report',
                titleKey: 'reports:sections.purchase.rice',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/sales',
        component: Reports,
        title: 'Sales Deals Report',
        titleKey: 'reports:sections.sales.title',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/sales/paddy',
                component: Reports,
                title: 'Paddy Deals Report',
                titleKey: 'reports:sections.sales.paddy',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/inward',
        component: Reports,
        title: 'Inward Report',
        titleKey: 'reports:sections.inward.title',
        icon: ArrowDownTrayIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/inward/paddy',
                component: Reports,
                title: 'Paddy Inward Report',
                titleKey: 'reports:sections.inward.paddy',
                showInSidebar: true,
            },
            {
                path: '/reports/inward/private',
                component: Reports,
                title: 'Private Inward Report',
                titleKey: 'reports:sections.inward.private',
                showInSidebar: true,
            },
            {
                path: '/reports/inward/rice',
                component: Reports,
                title: 'Rice Inward / Lot Deposit Report',
                titleKey: 'reports:sections.inward.rice',
                showInSidebar: true,
            },
        ],
    },

    // ===== UTILITY ROUTES (hidden from sidebar) =====
    {
        path: '/students',
        component: StudentEnrollments,
        title: 'Student Enrollments',
        titleKey: 'students:title',
        icon: UsersIcon,
        showInSidebar: false,
    },
    {
        path: '/ui/guide',
        component: UIGuide,
        title: 'UI Guide',
        titleKey: 'common:uiGuide',
        icon: PaintBrushIcon,
        showInSidebar: false,
    },
    {
        path: '/profile',
        component: Home,
        title: 'Profile',
        titleKey: 'common:profile',
        icon: UserIcon,
        showInSidebar: false,
    },
    {
        path: '/settings',
        component: Home,
        title: 'Settings',
        titleKey: 'common:settings',
        icon: Cog6ToothIcon,
        showInSidebar: false,
    },
];
