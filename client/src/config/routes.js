import { lazy } from 'react';
import {
    PaintBrushIcon,
    Cog6ToothIcon,
    UserIcon,
    DocumentTextIcon,
    ShoppingBagIcon,
    ArrowDownTrayIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    CogIcon,
    UserGroupIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

// Lazy load all page components for code splitting
const Home = lazy(() => import('@/pages/Core/Home'));
const Profile = lazy(() => import('@/pages/Core/Profile'));
const UIGuide = lazy(() => import('@/pages/Core/UIGuide'));
const Entry = lazy(() => import('@/pages/Core/Entry'));
const AddParty = lazy(() => import('@/pages/Entry/AddParty'));
const PartyEntryReport = lazy(() => import('@/pages/EntryReports/PartyEntryReport'));
const TransportersEntryReport = lazy(() => import('@/pages/EntryReports/TransportersEntryReport'));
const BrokerEntryReport = lazy(() => import('@/pages/EntryReports/BrokerEntryReport'));
const CommitteeEntryReport = lazy(() => import('@/pages/EntryReports/CommitteeEntryReport'));
const DOEntryReport = lazy(() => import('@/pages/EntryReports/DOEntryReport'));
const VehicleEntryReport = lazy(() => import('@/pages/EntryReports/VehicleEntryReport'));
const StaffEntryReport = lazy(() => import('@/pages/EntryReports/StaffEntryReport'));
const LaborTeamEntryReport = lazy(() => import('@/pages/EntryReports/LaborTeamEntryReport'));
const RemainingDOInfo = lazy(() => import('@/pages/EntryReports/RemainingDOInfo'));
const PaddyPurchaseDealReport = lazy(() => import('@/pages/Deal/PaddyPurchaseDealReport'));
const RicePurchaseDealReport = lazy(() => import('@/pages/Deal/RicePurchaseDealReport'));
const PaddySalesDealReport = lazy(() => import('@/pages/Deal/PaddySalesDealReport'));
const PaddyInwardReport = lazy(() => import('@/pages/Inward/PaddyInwardReport'));
const PrivateInwardReport = lazy(() => import('@/pages/Inward/PrivateInwardReport'));
const RiceInwardReport = lazy(() => import('@/pages/Inward/RiceInwardReport'));
const AddTransporters = lazy(() => import('@/pages/Entry/AddTransporters'));
const AddBroker = lazy(() => import('@/pages/Entry/AddBroker'));
const AddCommittee = lazy(() => import('@/pages/Entry/AddCommittee'));
const AddDOEntry = lazy(() => import('@/pages/Entry/AddDOEntry'));
const AddVehicleEntry = lazy(() => import('@/pages/Entry/AddVehicleEntry'));
const AddStaffEntry = lazy(() => import('@/pages/Entry/AddStaffEntry'));
const AddPaddyPurchase = lazy(() => import('@/pages/Purchase/AddPaddyPurchase'));
const AddRicePurchase = lazy(() => import('@/pages/Purchase/AddRicePurchase'));
const AddSackPurchase = lazy(() => import('@/pages/Purchase/AddSackPurchase'));
const AddFRKPurchase = lazy(() => import('@/pages/Purchase/AddFRKPurchase'));
const AddOtherPurchase = lazy(() => import('@/pages/Purchase/AddOtherPurchase'));
const AddPaddySalesDeal = lazy(() => import('@/pages/Deal/AddPaddySalesDeal'));
const AddRiceSales = lazy(() => import('@/pages/Sales/AddRiceSales'));
const AddSackSales = lazy(() => import('@/pages/Sales/AddSackSales'));
const AddFRKSales = lazy(() => import('@/pages/Sales/AddFRKSales'));
const AddBrokensSales = lazy(() => import('@/pages/Sales/AddBrokensSales'));
const AddBrewersSales = lazy(() => import('@/pages/Sales/AddBrewersSales'));
const AddOtherSales = lazy(() => import('@/pages/Sales/AddOtherSales'));
const AddGovPaddyInward = lazy(() => import('@/pages/Inward/AddGovPaddyInward'));
const AddPrivatePaddyInward = lazy(() => import('@/pages/Inward/AddPrivatePaddyInward'));
const AddRiceInward = lazy(() => import('@/pages/Inward/AddRiceInward'));
const AddSackInward = lazy(() => import('@/pages/Inward/AddSackInward'));
const AddFrkInward = lazy(() => import('@/pages/Inward/AddFrkInward'));
const AddOtherInward = lazy(() => import('@/pages/Inward/AddOtherInward'));
const AddPrivatePaddyOutward = lazy(() => import('@/pages/Outward/AddPrivatePaddyOutward'));
const AddGovtRiceOutward = lazy(() => import('@/pages/Outward/AddGovtRiceOutward'));
const AddPrivateRiceOutward = lazy(() => import('@/pages/Outward/AddPrivateRiceOutward'));
const AddGovtSackOutward = lazy(() => import('@/pages/Outward/AddGovtSackOutward'));
const AddPrivateSackOutward = lazy(() => import('@/pages/Outward/AddPrivateSackOutward'));
const AddFrkOutward = lazy(() => import('@/pages/Outward/AddFrkOutward'));
const AddBrokensOutward = lazy(() => import('@/pages/Outward/AddBrokensOutward'));
const AddBrewersOutward = lazy(() => import('@/pages/Outward/AddBrewersOutward'));
const AddHuskOutward = lazy(() => import('@/pages/Outward/AddHuskOutward'));
const AddRiceBranOutward = lazy(() => import('@/pages/Outward/AddRiceBranOutward'));
const AddWhiteBranOutward = lazy(() => import('@/pages/Outward/AddWhiteBranOutward'));
const AddOtherOutward = lazy(() => import('@/pages/Outward/AddOtherOutward'));
const AddPaddyMilling = lazy(() => import('@/pages/Milling/AddPaddyMilling'));
const AddRiceMilling = lazy(() => import('@/pages/Milling/AddRiceMilling'));
const AddOutwardLaborEntry = lazy(() => import('@/pages/LaborCost/AddOutwardLaborEntry'));
const OutwardLaborReport = lazy(() => import('@/pages/LaborCost/OutwardLaborReport'));
const AddInwardLaborEntry = lazy(() => import('@/pages/LaborCost/AddInwardLaborEntry'));
const AddMillingLaborEntry = lazy(() => import('@/pages/LaborCost/AddMillingLaborEntry'));
const AddOtherLaborEntry = lazy(() => import('@/pages/LaborCost/AddOtherLaborEntry'));
const InwardLaborReport = lazy(() => import('@/pages/LaborCost/InwardLaborReport'));
const MillingLaborReport = lazy(() => import('@/pages/LaborCost/MillingLaborReport'));
const OtherLaborReport = lazy(() => import('@/pages/LaborCost/OtherLaborReport'));
const OtherPurchaseDealReport = lazy(() => import('@/pages/Deal/OtherPurchaseDealReport'));
const OtherSalesDealReport = lazy(() => import('@/pages/Deal/OtherSalesDealReport'));
const OtherInwardReport = lazy(() => import('@/pages/Inward/OtherInwardReport'));
const OtherOutwardReport = lazy(() => import('@/pages/Outward/OtherOutwardReport'));
const SackPurchaseDealReport = lazy(() => import('@/pages/Deal/SackPurchaseDealReport'));
const FRKPurchaseDealReport = lazy(() => import('@/pages/Deal/FRKPurchaseDealReport'));
const RiceSalesDealReport = lazy(() => import('@/pages/Deal/RiceSalesDealReport'));
const SackSalesDealReport = lazy(() => import('@/pages/Deal/SackSalesDealReport'));
const FRKSalesDealReport = lazy(() => import('@/pages/Deal/FRKSalesDealReport'));
const BrokensSalesDealReport = lazy(() => import('@/pages/Deal/BrokensSalesDealReport'));
const BrewersSalesDealReport = lazy(() => import('@/pages/Deal/BrewersSalesDealReport'));
const HuskSalesDealReport = lazy(() => import('@/pages/Deal/HuskSalesDealReport'));
const RiceBranSalesDealReport = lazy(() => import('@/pages/Deal/RiceBranSalesDealReport'));
const WhiteBranSalesDealReport = lazy(() => import('@/pages/Deal/WhiteBranSalesDealReport'));
const SackInwardReport = lazy(() => import('@/pages/Inward/SackInwardReport'));
const FrkInwardReport = lazy(() => import('@/pages/Inward/FrkInwardReport'));
const PrivatePaddyOutwardReport = lazy(() => import('@/pages/Outward/PrivatePaddyOutwardReport'));
const GovtRiceOutwardReport = lazy(() => import('@/pages/Outward/GovtRiceOutwardReport'));
const PrivateRiceOutwardReport = lazy(() => import('@/pages/Outward/PrivateRiceOutwardReport'));
const GovtSackOutwardReport = lazy(() => import('@/pages/Outward/GovtSackOutwardReport'));
const PrivateSackOutwardReport = lazy(() => import('@/pages/Outward/PrivateSackOutwardReport'));
const FrkOutwardReport = lazy(() => import('@/pages/Outward/FrkOutwardReport'));
const BrokensOutwardReport = lazy(() => import('@/pages/Outward/BrokensOutwardReport'));
const BrewersOutwardReport = lazy(() => import('@/pages/Outward/BrewersOutwardReport'));
const HuskOutwardReport = lazy(() => import('@/pages/Outward/HuskOutwardReport'));
const RiceBranOutwardReport = lazy(() => import('@/pages/Outward/RiceBranOutwardReport'));
const WhiteBranOutwardReport = lazy(() => import('@/pages/Outward/WhiteBranOutwardReport'));
const PaddyMillingReport = lazy(() => import('@/pages/Milling/PaddyMillingReport'));
const RiceMillingReport = lazy(() => import('@/pages/Milling/RiceMillingReport'));
const AddAttendanceEntry = lazy(() => import('@/pages/Attendance/AddAttendanceEntry'));
const AttendanceReport = lazy(() => import('@/pages/Attendance/AttendanceReport'));
const ReportsPage = lazy(() => import('@/pages/Core/Reports'));
const ReceivingReport = lazy(() => import('@/pages/Financial/ReceivingReport'));
const PaymentReport = lazy(() => import('@/pages/Financial/PaymentReport'));
const AddReceivingEntry = lazy(() => import('@/pages/Financial/AddReceivingEntry'));
const AddPaymentEntry = lazy(() => import('@/pages/Financial/AddPaymentEntry'));
const AddLaborTeamEntry = lazy(() => import('@/pages/Entry/AddLaborTeamEntry'));

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
        titleKey: 'entry:nav.entry',
        icon: DocumentTextIcon,
        showInSidebar: false,
        view: 'entry',
    },
    {
        path: '/entry',
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
                component: AddCommittee,
                title: 'Add Committee',
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
            {
                path: '/entry/trucks',
                component: AddVehicleEntry,
                title: 'Add Truck',
                titleKey: 'entry:sections.entry.addVehicle',
                showInSidebar: true,
            },
            {
                path: '/entry/staff',
                component: AddStaffEntry,
                title: 'Add Staff',
                titleKey: 'entry:sections.entry.addStaff',
                showInSidebar: true,
            },
            {
                path: '/entry/labor-team',
                component: AddLaborTeamEntry,
                title: 'Labor Team',
                titleKey: 'entry:sections.entry.laborTeam',
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
        // component: ReportsPage, // Parent nav item - no component rendering
        title: 'Entry Report',
        titleKey: 'reports:sections.entry.title',
        icon: DocumentTextIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/entry/parties',
                component: PartyEntryReport,
                title: 'Information of Party',
                titleKey: 'reports:sections.entry.partyInfo',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/transporters',
                component: TransportersEntryReport,
                title: 'Transporters',
                titleKey: 'reports:sections.entry.transporters',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/brokers',
                component: BrokerEntryReport,
                title: 'Brokers',
                titleKey: 'reports:sections.entry.brokers',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/committee',
                component: CommitteeEntryReport,
                title: 'Committees',
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
                path: '/reports/entry/vehicles',
                component: VehicleEntryReport,
                title: 'Vehicle Report',
                titleKey: 'reports:sections.entry.vehicleReport',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/staff',
                component: StaffEntryReport,
                title: 'Staff Report',
                titleKey: 'reports:sections.entry.staffReport',
                showInSidebar: true,
            },
            {
                path: '/reports/entry/labor-teams',
                component: LaborTeamEntryReport,
                title: 'Labor Team Report',
                titleKey: 'reports:sections.entry.laborTeamReport',
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
        // component: ReportsPage, // Parent nav item - no component rendering
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
            {
                path: '/reports/purchase/sack',
                component: SackPurchaseDealReport,
                title: 'Sack Purchase Deal Report',
                titleKey: 'reports:sections.purchase.sack',
                showInSidebar: true,
            },
            {
                path: '/reports/purchase/frk',
                component: FRKPurchaseDealReport,
                title: 'FRK Purchase Deal Report',
                titleKey: 'reports:sections.purchase.frk',
                showInSidebar: true,
            },
            {
                path: '/reports/purchase/other',
                component: OtherPurchaseDealReport,
                title: 'Other Purchase Deal Report',
                titleKey: 'reports:sections.purchase.other',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/sales',
        // component: ReportsPage, // Parent nav item - no component rendering
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
            {
                path: '/reports/sales/rice',
                component: RiceSalesDealReport,
                title: 'Rice Sales Deal Report',
                titleKey: 'reports:sections.sales.rice',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/sack',
                component: SackSalesDealReport,
                title: 'Sack Sales Deal Report',
                titleKey: 'reports:sections.sales.sack',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/frk',
                component: FRKSalesDealReport,
                title: 'FRK Sales Deal Report',
                titleKey: 'reports:sections.sales.frk',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/brokens',
                component: BrokensSalesDealReport,
                title: 'Brokens Sales Deal Report',
                titleKey: 'reports:sections.sales.brokens',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/brewers',
                component: BrewersSalesDealReport,
                title: 'Brewers Sales Deal Report',
                titleKey: 'reports:sections.sales.brewers',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/husk',
                component: HuskSalesDealReport,
                title: 'Husk Sales Deal Report',
                titleKey: 'reports:sections.sales.husk',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/rice-bran',
                component: RiceBranSalesDealReport,
                title: 'Rice Bran Sales Deal Report',
                titleKey: 'reports:sections.sales.riceBran',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/white-bran',
                component: WhiteBranSalesDealReport,
                title: 'White Bran Sales Deal Report',
                titleKey: 'reports:sections.sales.whiteBran',
                showInSidebar: true,
            },
            {
                path: '/reports/sales/other',
                component: OtherSalesDealReport,
                title: 'Other Sales Deal Report',
                titleKey: 'reports:sections.sales.other',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/inward',
        // component: ReportsPage, // Parent nav item - no component rendering
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
            {
                path: '/reports/inward/sack',
                component: SackInwardReport,
                title: 'Sack Inward Report',
                titleKey: 'reports:sections.inward.sack',
                showInSidebar: true,
            },
            {
                path: '/reports/inward/frk',
                component: FrkInwardReport,
                title: 'FRK Inward Report',
                titleKey: 'reports:sections.inward.frk',
                showInSidebar: true,
            },
            {
                path: '/reports/inward/other',
                component: OtherInwardReport,
                title: 'Other Inward Report',
                titleKey: 'reports:sections.inward.other',
                showInSidebar: true,
            },
        ],
    },

    // ===== OUTWARD REPORT ROUTES =====
    {
        path: '/reports/outward',
        title: 'Outward Report',
        titleKey: 'reports:sections.outward.title',
        icon: ArrowDownTrayIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/outward/private-paddy',
                component: PrivatePaddyOutwardReport,
                title: 'Private Paddy Outward Report',
                titleKey: 'reports:sections.outward.privatePaddy',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/govt-rice',
                component: GovtRiceOutwardReport,
                title: 'Govt Rice Outward Report',
                titleKey: 'reports:sections.outward.govtRice',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/private-rice',
                component: PrivateRiceOutwardReport,
                title: 'Private Rice Outward Report',
                titleKey: 'reports:sections.outward.privateRice',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/govt-sack',
                component: GovtSackOutwardReport,
                title: 'Govt Sack Outward Report',
                titleKey: 'reports:sections.outward.govtSack',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/private-sack',
                component: PrivateSackOutwardReport,
                title: 'Private Sack Outward Report',
                titleKey: 'reports:sections.outward.privateSack',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/frk',
                component: FrkOutwardReport,
                title: 'FRK Outward Report',
                titleKey: 'reports:sections.outward.frk',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/brokens',
                component: BrokensOutwardReport,
                title: 'Brokens Outward Report',
                titleKey: 'reports:sections.outward.brokens',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/brewers',
                component: BrewersOutwardReport,
                title: 'Brewers Outward Report',
                titleKey: 'reports:sections.outward.brewers',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/husk',
                component: HuskOutwardReport,
                title: 'Husk Outward Report',
                titleKey: 'reports:sections.outward.husk',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/rice-bran',
                component: RiceBranOutwardReport,
                title: 'Rice Bran Outward Report',
                titleKey: 'reports:sections.outward.riceBran',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/white-bran',
                component: WhiteBranOutwardReport,
                title: 'White Bran Outward Report',
                titleKey: 'reports:sections.outward.whiteBran',
                showInSidebar: true,
            },
            {
                path: '/reports/outward/other',
                component: OtherOutwardReport,
                title: 'Other Outward Report',
                titleKey: 'reports:sections.outward.other',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/milling',
        title: 'Milling Report',
        titleKey: 'reports:sections.milling.title',
        icon: ArrowPathIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/milling/paddy',
                component: PaddyMillingReport,
                title: 'Paddy Milling Report',
                titleKey: 'reports:sections.milling.paddy',
                showInSidebar: true,
            },
            {
                path: '/reports/milling/rice',
                component: RiceMillingReport,
                title: 'Rice Milling Report',
                titleKey: 'reports:sections.milling.rice',
                showInSidebar: true,
            },
        ],
    },    // ===== LABOR COST REPORT ROUTES =====
    {
        path: '/reports/labor-cost',
        title: 'Labor Cost Report',
        titleKey: 'reports:sections.laborCost.title',
        icon: CurrencyDollarIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/labor-cost/inward',
                component: InwardLaborReport,
                title: 'Inward Labor Report',
                titleKey: 'reports:sections.laborCost.inward',
                showInSidebar: true,
            },
            {
                path: '/reports/labor-cost/outward',
                component: OutwardLaborReport,
                title: 'Outward Labor Report',
                titleKey: 'reports:sections.laborCost.outward',
                showInSidebar: true,
            },
            {
                path: '/reports/labor-cost/milling',
                component: MillingLaborReport,
                title: 'Milling Labor Report',
                titleKey: 'reports:sections.laborCost.milling',
                showInSidebar: true,
            },
            {
                path: '/reports/labor-cost/other',
                component: OtherLaborReport,
                title: 'Other Labor Report',
                titleKey: 'reports:sections.laborCost.other',
                showInSidebar: true,
            },
        ],
    },

    // ===== ATTENDANCE REPORT ROUTES =====
    {
        path: '/reports/attendance',
        component: AttendanceReport,
        title: 'Attendance Report',
        titleKey: 'reports:sections.attendance.title',
        icon: UserGroupIcon,
        showInSidebar: true,
        view: 'reports',
    },

    // ===== LABOR COST ROUTES =====
    {
        path: '/labor-cost',
        title: 'Labor Cost',
        titleKey: 'entry:sections.laborCost.title',
        icon: CurrencyDollarIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/labor-cost/inward',
                component: AddInwardLaborEntry,
                title: 'Inward Labor',
                titleKey: 'entry:sections.laborCost.inward',
                showInSidebar: true,
            },
            {
                path: '/labor-cost/outward',
                component: AddOutwardLaborEntry,
                title: 'Outward Labor',
                titleKey: 'entry:sections.laborCost.outward',
                showInSidebar: true,
            },
            {
                path: '/labor-cost/milling',
                component: AddMillingLaborEntry,
                title: 'Milling Labor',
                titleKey: 'entry:sections.laborCost.milling',
                showInSidebar: true,
            },
            {
                path: '/labor-cost/other',
                component: AddOtherLaborEntry,
                title: 'Other Labor',
                titleKey: 'entry:sections.laborCost.other',
                showInSidebar: true,
            },
        ],
    },
    {
        path: '/reports/financial',
        title: 'Financial Report',
        titleKey: 'reports:sections.financial.title',
        icon: CurrencyDollarIcon,
        showInSidebar: true,
        view: 'reports',
        children: [
            {
                path: '/reports/financial/receiving',
                component: ReceivingReport,
                title: 'Receiving Report',
                titleKey: 'reports:sections.financial.receiving',
                showInSidebar: true,
            },
            {
                path: '/reports/financial/payment',
                component: PaymentReport,
                title: 'Payment Report',
                titleKey: 'reports:sections.financial.payment',
                showInSidebar: true,
            },
        ],
    },

    // ===== FINANCIAL ROUTES =====
    {
        path: '/financial',
        title: 'Receiving / Payment',
        titleKey: 'entry:sections.financial.title',
        icon: BanknotesIcon,
        showInSidebar: true,
        view: 'entry',
        children: [
            {
                path: '/financial/receiving',
                component: AddReceivingEntry,
                title: 'Receiving (Receipt)',
                titleKey: 'entry:sections.financial.receiving',
                showInSidebar: true,
            },
            {
                path: '/financial/payment',
                component: AddPaymentEntry,
                title: 'Payment',
                titleKey: 'entry:sections.financial.payment',
                showInSidebar: true,
            },
        ],
    },

    // ===== ATTENDANCE ENTRY ROUTES =====
    {
        path: '/entry/attendance',
        component: AddAttendanceEntry,
        title: 'Mark Attendance',
        titleKey: 'entry:sections.attendance.title',
        icon: UserGroupIcon,
        showInSidebar: true,
        view: 'entry',
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
        component: Profile,
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