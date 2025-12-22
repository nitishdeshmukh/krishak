import { lazy } from 'react';
import {
    PaintBrushIcon,
    Cog6ToothIcon,
    UserIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    ArrowDownTrayIcon,
    CurrencyDollarIcon,
    CogIcon
} from '@heroicons/react/24/outline';

// Lazy load all page components for code splitting
const Home = lazy(() => import('@/pages/Home'));
const UIGuide = lazy(() => import('@/pages/UIGuide'));
const Entry = lazy(() => import('@/pages/Entry'));
const AddParty = lazy(() => import('@/pages/AddParty'));
const PartyInfo = lazy(() => import('@/pages/PartyInfo'));
const TransportersInfo = lazy(() => import('@/pages/TransportersInfo'));
const BrokerInfo = lazy(() => import('@/pages/BrokerInfo'));
const CommitteeProcurementInfo = lazy(() => import('@/pages/CommitteeProcurementInfo'));
const DOEntryReport = lazy(() => import('@/pages/DOEntryReport'));
const RemainingDOInfo = lazy(() => import('@/pages/RemainingDOInfo'));
const PaddyPurchaseDealReport = lazy(() => import('@/pages/PaddyPurchaseDealReport'));
const RicePurchaseDealReport = lazy(() => import('@/pages/RicePurchaseDealReport'));
const PaddySalesDealReport = lazy(() => import('@/pages/PaddySalesDealReport'));
const PaddyInwardReport = lazy(() => import('@/pages/PaddyInwardReport'));
const PrivateInwardReport = lazy(() => import('@/pages/PrivateInwardReport'));
const RiceInwardReport = lazy(() => import('@/pages/RiceInwardReport'));
const AddTransporters = lazy(() => import('@/pages/AddTransporters'));
const AddBroker = lazy(() => import('@/pages/AddBroker'));
const AddCommitteeProcurement = lazy(() => import('@/pages/AddCommitteeProcurement'));
const AddDOEntry = lazy(() => import('@/pages/AddDOEntry'));
const AddPaddyPurchase = lazy(() => import('@/pages/AddPaddyPurchase'));
const AddRicePurchase = lazy(() => import('@/pages/AddRicePurchase'));
const AddSackPurchase = lazy(() => import('@/pages/AddSackPurchase'));
const AddFRKPurchase = lazy(() => import('@/pages/AddFRKPurchase'));
const AddOtherPurchase = lazy(() => import('@/pages/AddOtherPurchase'));
const AddPaddySalesDeal = lazy(() => import('@/pages/AddPaddySalesDeal'));
const AddRiceSales = lazy(() => import('@/pages/AddRiceSales'));
const AddSackSales = lazy(() => import('@/pages/AddSackSales'));
const AddFRKSales = lazy(() => import('@/pages/AddFRKSales'));
const AddBrokensSales = lazy(() => import('@/pages/AddBrokensSales'));
const AddBrewersSales = lazy(() => import('@/pages/AddBrewersSales'));
const AddHuskSales = lazy(() => import('@/pages/AddHuskSales'));
const AddRiceBranSales = lazy(() => import('@/pages/AddRiceBranSales'));
const AddWhiteBranSales = lazy(() => import('@/pages/AddWhiteBranSales'));
const AddOtherSales = lazy(() => import('@/pages/AddOtherSales'));
const AddGovPaddyInward = lazy(() => import('@/pages/AddGovPaddyInward'));
const AddPrivatePaddyInward = lazy(() => import('@/pages/AddPrivatePaddyInward'));
const AddRiceInward = lazy(() => import('@/pages/AddRiceInward'));
const AddSackInward = lazy(() => import('@/pages/AddSackInward'));
const AddFrkInward = lazy(() => import('@/pages/AddFrkInward'));
const AddOtherInward = lazy(() => import('@/pages/AddOtherInward'));
const AddPrivatePaddyOutward = lazy(() => import('@/pages/AddPrivatePaddyOutward'));
const AddGovtRiceOutward = lazy(() => import('@/pages/AddGovtRiceOutward'));
const AddPrivateRiceOutward = lazy(() => import('@/pages/AddPrivateRiceOutward'));
const AddGovtSackOutward = lazy(() => import('@/pages/AddGovtSackOutward'));
const AddPrivateSackOutward = lazy(() => import('@/pages/AddPrivateSackOutward'));
const AddFrkOutward = lazy(() => import('@/pages/AddFrkOutward'));
const AddBrokensOutward = lazy(() => import('@/pages/AddBrokensOutward'));
const AddBrewersOutward = lazy(() => import('@/pages/AddBrewersOutward'));
const AddHuskOutward = lazy(() => import('@/pages/AddHuskOutward'));
const AddRiceBranOutward = lazy(() => import('@/pages/AddRiceBranOutward'));
const AddWhiteBranOutward = lazy(() => import('@/pages/AddWhiteBranOutward'));
const AddOtherOutward = lazy(() => import('@/pages/AddOtherOutward'));
const AddPaddyMilling = lazy(() => import('@/pages/AddPaddyMilling'));
const AddRiceMilling = lazy(() => import('@/pages/AddRiceMilling'));
const ReportsPage = lazy(() => import('@/pages/Reports'));

/**
* Centralized route configuration
* Automatically syncs across App.jsx, AppSidebar.jsx, and AppLayout.jsx
*/
export const routes = [
    // ===== ENTRY VIEW ROUTES =====
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
                component: AddParty,
                title: 'Add Party',
                titleKey: 'entry:sections.entry.addParty',
                showInSidebar: true,
            },
            {
                path: '/entry/transporters',
                component: AddTransporters,
                title: 'Add Transporters',
                titleKey: 'entry:sections.entry.addTransporters',
                showInSidebar: true,
            },
            {
                path: '/entry/brokers',
                component: AddBroker,
                title: 'Add Brokers',
                titleKey: 'entry:sections.entry.addBrokers',
                showInSidebar: true,
            },
            {
                path: '/entry/committee',
                component: AddCommitteeProcurement,
                title: 'Add Committee Procurement',
                titleKey: 'entry:sections.entry.addCommittee',
                showInSidebar: true,
            },
            {
                path: '/entry/do',
                component: AddDOEntry,
                title: 'DO Entry',
                titleKey: 'entry:sections.entry.doEntry',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/purchase',
        component: Entry,
        title: 'Purchase Deals',
        titleKey: 'entry:sections.purchase.title',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/purchase/paddy',
                component: AddPaddyPurchase,
                title: 'Paddy Purchase Deal',
                titleKey: 'entry:sections.purchase.paddy',
                showInSidebar: true,
            },
            {
                path: '/purchase/rice',
                component: AddRicePurchase,
                title: 'Rice Purchase Deal',
                titleKey: 'entry:sections.purchase.rice',
                showInSidebar: true,
            },
            {
                path: '/purchase/sack',
                component: AddSackPurchase,
                title: 'Sack Purchase',
                titleKey: 'entry:sections.purchase.sack',
                showInSidebar: true,
            },
            {
                path: '/purchase/frk',
                component: AddFRKPurchase,
                title: 'FRK Purchase',
                titleKey: 'entry:sections.purchase.frk',
                showInSidebar: true,
            },
            {
                path: '/purchase/other',
                component: AddOtherPurchase,
                title: 'Other Purchase',
                titleKey: 'entry:sections.purchase.other',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/sales',
        component: Entry,
        title: 'Sales Deals',
        titleKey: 'entry:sections.sales.title',
        icon: CurrencyDollarIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/sales/paddy',
                component: AddPaddySalesDeal,
                title: 'Paddy Deals',
                titleKey: 'entry:sections.sales.paddy',
                showInSidebar: true,
            },
            {
                path: '/sales/rice',
                component: AddRiceSales,
                title: 'Rice Sales Deal',
                titleKey: 'entry:sections.sales.rice',
                showInSidebar: true,
            },
            {
                path: '/sales/sack',
                component: AddSackSales,
                title: 'Sack Sales Deal',
                titleKey: 'entry:sections.sales.sack',
                showInSidebar: true,
            },
            {
                path: '/sales/frk',
                component: AddFRKSales,
                title: 'FRK Sales Deal',
                titleKey: 'entry:sections.sales.frk',
                showInSidebar: true,
            },
            {
                path: '/sales/brokens',
                component: AddBrokensSales,
                title: 'Brokens Sales Deal',
                titleKey: 'entry:sections.sales.brokens',
                showInSidebar: true,
            },
            {
                path: '/sales/brewers',
                component: AddBrewersSales,
                title: 'Brewers Sales Deal',
                titleKey: 'entry:sections.sales.brewers',
                showInSidebar: true,
            },
            {
                path: '/sales/husk',
                component: AddHuskSales,
                title: 'Husk Sales Deal',
                titleKey: 'entry:sections.sales.husk',
                showInSidebar: true,
            },
            {
                path: '/sales/ricebran',
                component: AddRiceBranSales,
                title: 'Rice Bran Sales Deal',
                titleKey: 'entry:sections.sales.ricebran',
                showInSidebar: true,
            },
            {
                path: '/sales/whitebran',
                component: AddWhiteBranSales,
                title: 'White Bran Sales Deal',
                titleKey: 'entry:sections.sales.whitebran',
                showInSidebar: true,
            },
            {
                path: '/sales/other',
                component: AddOtherSales,
                title: 'Other Sales Deal',
                titleKey: 'entry:sections.sales.other',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/inward',
        component: Entry,
        title: 'Inward',
        titleKey: 'entry:sections.inward.title',
        icon: ArrowDownTrayIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/inward/govt-paddy',
                component: AddGovPaddyInward,
                title: 'Government Paddy Inward',
                titleKey: 'entry:sections.inward.govtPaddy',
                showInSidebar: true,
            },
            {
                path: '/inward/private-paddy',
                component: AddPrivatePaddyInward,
                title: 'Private Paddy Inward',
                titleKey: 'entry:sections.inward.privatePaddy',
                showInSidebar: true,
            },
            {
                path: '/inward/rice',
                component: AddRiceInward,
                title: 'Rice Inward / Lot Deposit',
                titleKey: 'entry:sections.inward.rice',
                showInSidebar: true,
            },
            {
                path: '/inward/sack',
                component: AddSackInward,
                title: 'Sack Inward',
                titleKey: 'entry:sections.inward.sack',
                showInSidebar: true,
            },
            {
                path: '/inward/frk',
                component: AddFrkInward,
                title: 'FRK Inward',
                titleKey: 'entry:sections.inward.frk',
                showInSidebar: true,
            },
            {
                path: '/inward/other',
                component: AddOtherInward,
                title: 'Other Inward',
                titleKey: 'entry:sections.inward.other',
                showInSidebar: true,
            },
        ],
    },

    // ===== OUTWARD VIEW ROUTES =====
    {
        path: '/outward',
        component: Entry,
        title: 'Outward',
        titleKey: 'entry:nav.outward',
        icon: ArrowDownTrayIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/outward/private-paddy',
                component: AddPrivatePaddyOutward,
                title: 'Private Paddy Outward',
                titleKey: 'entry:sections.outward.privatePaddy',
                showInSidebar: true,
            },
            {
                path: '/outward/govt-rice',
                component: AddGovtRiceOutward,
                title: 'Govt Rice Outward',
                titleKey: 'entry:sections.outward.govtRice',
                showInSidebar: true,
            },
            {
                path: '/outward/private-rice',
                component: AddPrivateRiceOutward,
                title: 'Private Rice Outward',
                titleKey: 'entry:sections.outward.privateRice',
                showInSidebar: true,
            },
            {
                path: '/outward/govt-sack',
                component: AddGovtSackOutward,
                title: 'Govt Sack Outward',
                titleKey: 'entry:sections.outward.govtSack',
                showInSidebar: true,
            },
            {
                path: '/outward/private-sack',
                component: AddPrivateSackOutward,
                title: 'Private Sack Outward',
                titleKey: 'entry:sections.outward.privateSack',
                showInSidebar: true,
            },
            {
                path: '/outward/frk',
                component: AddFrkOutward,
                title: 'FRK Outward',
                titleKey: 'entry:sections.outward.frk',
                showInSidebar: true,
            },
            {
                path: '/outward/brokens',
                component: AddBrokensOutward,
                title: 'Brokens Outward',
                titleKey: 'entry:sections.outward.brokens',
                showInSidebar: true,
            },
            {
                path: '/outward/brewers',
                component: AddBrewersOutward,
                title: 'Brewers Outward',
                titleKey: 'entry:sections.outward.brewers',
                showInSidebar: true,
            },
            {
                path: '/outward/husk',
                component: AddHuskOutward,
                title: 'Husk Outward',
                titleKey: 'entry:sections.outward.husk',
                showInSidebar: true,
            },
            {
                path: '/outward/rice-bran',
                component: AddRiceBranOutward,
                title: 'Rice Bran Outward',
                titleKey: 'entry:sections.outward.riceBran',
                showInSidebar: true,
            },
            {
                path: '/outward/white-bran',
                component: AddWhiteBranOutward,
                title: 'White Bran Outward',
                titleKey: 'entry:sections.outward.whiteBran',
                showInSidebar: true,
            },
            {
                path: '/outward/other',
                component: AddOtherOutward,
                title: 'Other Outward',
                titleKey: 'entry:sections.outward.other',
                showInSidebar: true,
            },
        ],
    },

    // ===== MILLING VIEW ROUTES =====
    {
        path: '/milling',
        component: Entry,
        title: 'Milling',
        titleKey: 'entry:nav.milling',
        icon: CogIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/milling/paddy',
                component: AddPaddyMilling,
                title: 'Paddy Milling',
                titleKey: 'entry:sections.milling.paddy',
                showInSidebar: true,
            },
            {
                path: '/milling/rice',
                component: AddRiceMilling,
                title: 'Rice Milling',
                titleKey: 'entry:sections.milling.rice',
                showInSidebar: true,
            },
        ],
    },

    // ===== REPORTS VIEW ROUTES =====
    {
        path: '/reports',
        component: ReportsPage,
        title: 'Reports',
        titleKey: 'entry:nav.reports',
        icon: DocumentTextIcon,
        showInSidebar: false,
        view: 'reports',
    },
    {
        path: '/reports/entry',
        component: ReportsPage,
        title: 'Entry Report',
        titleKey: 'reports:sections.entry.title',
        icon: DocumentTextIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/entry/party-info',
                component: PartyInfo,
                title: 'Information of Party',
                titleKey: 'reports:sections.entry.partyInfo',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/transporters',
                component: TransportersInfo,
                title: 'Transporters',
                titleKey: 'reports:sections.entry.transporters',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/brokers',
                component: BrokerInfo,
                title: 'Brokers',
                titleKey: 'reports:sections.entry.brokers',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/committee',
                component: CommitteeProcurementInfo,
                title: 'Committee Procurement',
                titleKey: 'reports:sections.entry.committee',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/do',
                component: DOEntryReport,
                title: 'DO Entry Report',
                titleKey: 'reports:sections.entry.doReport',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/remaining-do',
                component: RemainingDOInfo,
                title: 'Details of Remaining DO Lifting',
                titleKey: 'reports:sections.entry.remainingDO',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/purchase',
        component: ReportsPage,
        title: 'Purchase Deals Report',
        titleKey: 'reports:sections.purchase.title',
        icon: ShoppingBagIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/purchase/paddy',
                component: PaddyPurchaseDealReport,
                title: 'Paddy Purchase Deal Report',
                titleKey: 'reports:sections.purchase.paddy',
                showInSidebar: true,
            },
            {
                path: '/reports/purchase/rice',
                component: RicePurchaseDealReport,
                title: 'Rice Purchase Deal Report',
                titleKey: 'reports:sections.purchase.rice',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/sales',
        component: ReportsPage,
        title: 'Sales Deals Report',
        titleKey: 'reports:sections.sales.title',
        icon: CurrencyDollarIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/sales/paddy',
                component: PaddySalesDealReport,
                title: 'Paddy Deals Report',
                titleKey: 'reports:sections.sales.paddy',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/inward',
        component: ReportsPage,
        title: 'Inward Report',
        titleKey: 'reports:sections.inward.title',
        icon: ArrowDownTrayIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/inward/paddy',
                component: PaddyInwardReport,
                title: 'Paddy Inward Report',
                titleKey: 'reports:sections.inward.paddy',
                showInSidebar: true,
            },
            {
                path: '/reports/inward/private',
                component: PrivateInwardReport,
                title: 'Private Inward Report',
                titleKey: 'reports:sections.inward.private',
                showInSidebar: true,
            },
            {
                path: '/reports/inward/rice',
                component: RiceInwardReport,
                title: 'Rice Inward / Lot Deposit Report',
                titleKey: 'reports:sections.inward.rice',
                showInSidebar: true,
            },
        ],
    },

    // ===== UTILITY ROUTES (hidden from sidebar) =====
    {
        path: '/ui/guide',
        component: UIGuide,
        title: 'UI Guide',
        titleKey: 'common:uiGuide',
        icon: PaintBrushIcon,
        showInSidebar: false,
        view: 'utility',
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