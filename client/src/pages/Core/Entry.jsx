"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    UserPlusIcon,
    TruckIcon,
    UserGroupIcon,
    BuildingOffice2Icon,
    DocumentTextIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    BanknotesIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '@/components/DashboardCard';

export default function EntryPage() {
    const { t } = useTranslation(['entry']);
    const navigate = useNavigate();

    // Management cards configuration
    const managementCards = [
        {
            icon: UserPlusIcon,
            title: t('entry:entry.management.addParty') || 'Add Party',
            onClick: () => navigate('/entry/party'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: TruckIcon,
            title: t('entry:entry.management.addTransporter') || 'Add Transporter',
            onClick: () => navigate('/entry/transporters'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: UserGroupIcon,
            title: t('entry:entry.management.addWorker') || 'Add Broker',
            onClick: () => navigate('/entry/brokers'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: BuildingOffice2Icon,
            title: t('entry:entry.management.propertyManagement') || 'Committee/Property',
            onClick: () => navigate('/entry/committee'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: DocumentTextIcon,
            title: t('entry:entry.management.doEntry') || 'DO Entry',
            onClick: () => navigate('/entry/do'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: TruckIcon,
            title: t('entry:entry.management.addVehicle') || 'Add Truck',
            onClick: () => navigate('/entry/trucks'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: UserGroupIcon,
            title: t('entry:entry.management.addStaff') || 'Add Staff',
            onClick: () => navigate('/entry/staff'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    // Purchase deals cards configuration
    const purchaseCards = [
        {
            icon: ShoppingBagIcon,
            title: t('entry:sections.purchase.paddy') || 'Paddy Purchase',
            onClick: () => navigate('/purchase/paddy'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('entry:sections.purchase.rice') || 'Rice Purchase',
            onClick: () => navigate('/purchase/rice'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('entry:sections.purchase.sack') || 'Sack Purchase',
            onClick: () => navigate('/purchase/sack'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('entry:sections.purchase.frk') || 'FRK Purchase',
            onClick: () => navigate('/purchase/frk'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('entry:sections.purchase.other') || 'Other Purchase',
            onClick: () => navigate('/purchase/other'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
    ];

    // Sales deals cards configuration
    const salesCards = [
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.paddy') || 'Paddy Sales',
            onClick: () => navigate('/sales/paddy'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.rice') || 'Rice Sales',
            onClick: () => navigate('/sales/rice'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.sack') || 'Sack Sales',
            onClick: () => navigate('/sales/sack'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.frk') || 'FRK Sales',
            onClick: () => navigate('/sales/frk'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.brokens') || 'Brokens Sales',
            onClick: () => navigate('/sales/brokens'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.brewers') || 'Brewers Sales',
            onClick: () => navigate('/sales/brewers'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.husk') || 'Husk Sales',
            onClick: () => navigate('/sales/husk'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.riceBran') || 'Rice Bran Sales',
            onClick: () => navigate('/sales/rice-bran'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.whiteBran') || 'White Bran Sales',
            onClick: () => navigate('/sales/white-bran'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:sections.sales.other') || 'Other Sales',
            onClick: () => navigate('/sales/other'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
    ];

    // Inward cards
    const inwardCards = [
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:sections.inward.govtPaddy') || 'Govt Paddy Inward',
            onClick: () => navigate('/inward/govt-paddy'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:sections.inward.privatePaddy') || 'Private Paddy Inward',
            onClick: () => navigate('/inward/private-paddy'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:sections.inward.rice') || 'Rice Inward / Lot',
            onClick: () => navigate('/inward/rice'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:sections.inward.sack') || 'Sack Inward',
            onClick: () => navigate('/inward/sack'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:sections.inward.frk') || 'FRK Inward',
            onClick: () => navigate('/inward/frk'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:sections.inward.other') || 'Other Inward',
            onClick: () => navigate('/inward/other'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    ];

    // Outward cards
    const outwardCards = [
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.privatePaddy') || 'Private Paddy Outward',
            onClick: () => navigate('/outward/private-paddy'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.govtRice') || 'Govt Rice Outward',
            onClick: () => navigate('/outward/govt-rice'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.privateRice') || 'Private Rice Outward',
            onClick: () => navigate('/outward/private-rice'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.govtSack') || 'Govt Sack Outward',
            onClick: () => navigate('/outward/govt-sack'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.privateSack') || 'Private Sack Outward',
            onClick: () => navigate('/outward/private-sack'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.frk') || 'FRK Outward',
            onClick: () => navigate('/outward/frk'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.brokens') || 'Brokens Outward',
            onClick: () => navigate('/outward/brokens'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.brewers') || 'Brewers Outward',
            onClick: () => navigate('/outward/brewers'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.husk') || 'Husk Outward',
            onClick: () => navigate('/outward/husk'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.riceBran') || 'Rice Bran Outward',
            onClick: () => navigate('/outward/rice-bran'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.whiteBran') || 'White Bran Outward',
            onClick: () => navigate('/outward/white-bran'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('entry:sections.outward.other') || 'Other Outward',
            onClick: () => navigate('/outward/other'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
    ];

    // Milling cards
    const millingCards = [
        {
            icon: CogIcon,
            title: t('entry:sections.milling.paddy') || 'Paddy Milling',
            onClick: () => navigate('/milling/paddy'),
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
        },
        {
            icon: CogIcon,
            title: t('entry:sections.milling.rice') || 'Rice Milling',
            onClick: () => navigate('/milling/rice'),
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Management Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <UserGroupIcon className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold">{t('entry:entry.management.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {managementCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Purchase Deals Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                    <h2 className="text-2xl font-bold">{t('entry:entry.purchaseDeals.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {purchaseCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Sales Deals Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
                    <h2 className="text-2xl font-bold">{t('entry:sections.sales.title') || 'Sales Deals'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {salesCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Inward Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">{t('entry:entry.inward.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inwardCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Outward Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowPathIcon className="h-6 w-6 text-red-600" />
                    <h2 className="text-2xl font-bold">{t('entry:sections.outward.title') || 'Outward Entries'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {outwardCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Milling Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <CogIcon className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold">{t('entry:sections.milling.title') || 'Milling Entries'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {millingCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Labor Cost Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <UserGroupIcon className="h-6 w-6 text-orange-600" />
                    <h2 className="text-2xl font-bold">{t('entry:entry.laborCost.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: UserGroupIcon,
                            title: t('entry:entry.laborCost.inward'),
                            onClick: () => navigate('/labor-cost/inward'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                        {
                            icon: UserGroupIcon,
                            title: t('entry:entry.laborCost.outward'),
                            onClick: () => navigate('/labor-cost/outward'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                        {
                            icon: UserGroupIcon,
                            title: t('entry:entry.laborCost.milling'),
                            onClick: () => navigate('/labor-cost/milling'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                        {
                            icon: UserGroupIcon,
                            title: t('entry:entry.laborCost.other'),
                            onClick: () => navigate('/labor-cost/other'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                    ].map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Attendance Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <UserGroupIcon className="h-6 w-6 text-teal-600" />
                    <h2 className="text-2xl font-bold">{t('entry:entry.attendance.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: UserGroupIcon,
                            title: t('entry:entry.attendance.markAttendance'),
                            onClick: () => navigate('/entry/attendance'),
                            iconBg: 'bg-teal-100',
                            iconColor: 'text-teal-600',
                        },
                    ].map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Financial Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                    <h2 className="text-2xl font-bold">{t('entry:sections.financial.title') || 'Financial'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: BanknotesIcon,
                            title: t('entry:sections.financial.receiving') || 'Receiving',
                            onClick: () => navigate('/financial/receiving'),
                            iconBg: 'bg-yellow-100',
                            iconColor: 'text-yellow-600',
                        },
                        {
                            icon: BanknotesIcon,
                            title: t('entry:sections.financial.payment') || 'Payment',
                            onClick: () => navigate('/financial/payment'),
                            iconBg: 'bg-yellow-100',
                            iconColor: 'text-yellow-600',
                        },
                    ].map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>
        </div>
    );
}
