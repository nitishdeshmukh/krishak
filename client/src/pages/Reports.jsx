"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    UserGroupIcon,
    TruckIcon,
    UserIcon,
    BuildingOffice2Icon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    ShoppingBagIcon,
    CurrencyDollarIcon,
    ArrowDownTrayIcon,
    ArrowPathIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '@/components/DashboardCard';

export default function ReportsPage() {
    const { t } = useTranslation(['reports']);
    const navigate = useNavigate();

    // Entry Reports cards configuration
    const entryReportCards = [
        {
            icon: UserGroupIcon,
            title: t('reports:sections.entry.partyInfo'),
            onClick: () => navigate('/reports/entry/party-info'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: TruckIcon,
            title: t('reports:sections.entry.transporters'),
            onClick: () => navigate('/reports/entry/transporters'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: UserIcon,
            title: t('reports:sections.entry.brokers'),
            onClick: () => navigate('/reports/entry/brokers'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: BuildingOffice2Icon,
            title: t('reports:sections.entry.committee'),
            onClick: () => navigate('/reports/entry/committee'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: DocumentTextIcon,
            title: t('reports:sections.entry.doReport'),
            onClick: () => navigate('/reports/entry/do'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: ClipboardDocumentListIcon,
            title: t('reports:sections.entry.remainingDO'),
            onClick: () => navigate('/reports/entry/remaining-do'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    // Purchase Deal Reports cards configuration
    const purchaseReportCards = [
        {
            icon: ShoppingBagIcon,
            title: t('reports:sections.purchase.paddy'),
            onClick: () => navigate('/reports/purchase/paddy'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('reports:sections.purchase.rice'),
            onClick: () => navigate('/reports/purchase/rice'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('reports:sections.purchase.sack'),
            onClick: () => navigate('/reports/purchase/sack'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('reports:sections.purchase.frk'),
            onClick: () => navigate('/reports/purchase/frk'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('reports:sections.purchase.other') || 'Other Purchase',
            onClick: () => navigate('/reports/purchase/other'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
    ];

    // Sales Deal Reports cards configuration
    const salesReportCards = [
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.paddy'),
            onClick: () => navigate('/reports/sales/paddy'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.rice'),
            onClick: () => navigate('/reports/sales/rice'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.sack'),
            onClick: () => navigate('/reports/sales/sack'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.frk'),
            onClick: () => navigate('/reports/sales/frk'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.brokens'),
            onClick: () => navigate('/reports/sales/brokens'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.brewers'),
            onClick: () => navigate('/reports/sales/brewers'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.husk'),
            onClick: () => navigate('/reports/sales/husk'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.riceBran'),
            onClick: () => navigate('/reports/sales/rice-bran'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.whiteBran'),
            onClick: () => navigate('/reports/sales/white-bran'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.other') || 'Other Sales',
            onClick: () => navigate('/reports/sales/other'),
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
    ];

    // Inward Reports cards configuration
    const inwardReportCards = [
        {
            icon: ArrowDownTrayIcon,
            title: t('reports:sections.inward.paddy'),
            onClick: () => navigate('/reports/inward/paddy'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('reports:sections.inward.private'),
            onClick: () => navigate('/reports/inward/private'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('reports:sections.inward.rice'),
            onClick: () => navigate('/reports/inward/rice'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('reports:sections.inward.sack'),
            onClick: () => navigate('/reports/inward/sack'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('reports:sections.inward.frk'),
            onClick: () => navigate('/reports/inward/frk'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('reports:sections.inward.other') || 'Other Inward',
            onClick: () => navigate('/reports/inward/other'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    ];

    // Outward Reports cards configuration
    const outwardReportCards = [
        {
            icon: ArrowPathIcon, // Using ArrowPath for outward as simple alternative or default
            title: t('reports:sections.outward.privatePaddy'),
            onClick: () => navigate('/reports/outward/private-paddy'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.govtRice'),
            onClick: () => navigate('/reports/outward/govt-rice'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.privateRice'),
            onClick: () => navigate('/reports/outward/private-rice'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.govtSack'),
            onClick: () => navigate('/reports/outward/govt-sack'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.privateSack'),
            onClick: () => navigate('/reports/outward/private-sack'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.frk'),
            onClick: () => navigate('/reports/outward/frk'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.brokens'),
            onClick: () => navigate('/reports/outward/brokens'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.brewers'),
            onClick: () => navigate('/reports/outward/brewers'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.husk'),
            onClick: () => navigate('/reports/outward/husk'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.riceBran'),
            onClick: () => navigate('/reports/outward/rice-bran'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.whiteBran'),
            onClick: () => navigate('/reports/outward/white-bran'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.outward.other') || 'Other Outward',
            onClick: () => navigate('/reports/outward/other'),
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
    ];

    // Milling Reports cards
    const millingReportCards = [
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.milling.paddy'),
            onClick: () => navigate('/reports/milling/paddy'),
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
        },
        {
            icon: ArrowPathIcon,
            title: t('reports:sections.milling.rice'),
            onClick: () => navigate('/reports/milling/rice'),
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Entry Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <UserGroupIcon className="h-6 w-6 text-purple-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.entry.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {entryReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Purchase Deal Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingBagIcon className="h-6 w-6 text-green-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.purchase.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {purchaseReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Sales Deal Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <CurrencyDollarIcon className="h-6 w-6 text-emerald-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.sales.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {salesReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Inward Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.inward.title')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inwardReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Outward Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowPathIcon className="h-6 w-6 text-red-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.outward.title') || 'Outward Reports'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {outwardReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Milling Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <ArrowPathIcon className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.milling.title') || 'Milling Reports'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {millingReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Labor Cost Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <UserGroupIcon className="h-6 w-6 text-orange-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.laborCost.title') || 'Labor Cost Reports'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: UserGroupIcon,
                            title: t('reports:sections.laborCost.inward') || 'Inward Labor (जावक हमाली)',
                            onClick: () => navigate('/reports/labor-cost/inward'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                        {
                            icon: UserGroupIcon,
                            title: t('reports:sections.laborCost.outward') || 'Outward Labor (जावक हमाली)',
                            onClick: () => navigate('/reports/labor-cost/outward'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                        {
                            icon: UserGroupIcon,
                            title: t('reports:sections.laborCost.milling') || 'Milling Labor (मिलिंग हमाली)',
                            onClick: () => navigate('/reports/labor-cost/milling'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                        {
                            icon: UserGroupIcon,
                            title: t('reports:sections.laborCost.other') || 'Other Labor (अन्य हमाली)',
                            onClick: () => navigate('/reports/labor-cost/other'),
                            iconBg: 'bg-orange-100',
                            iconColor: 'text-orange-600',
                        },
                    ].map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Attendance Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <UserGroupIcon className="h-6 w-6 text-teal-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.attendance.title') || 'Attendance Reports'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: UserGroupIcon,
                            title: t('reports:sections.attendance.title') || 'Attendance Report (उपस्थिति रिपोर्ट)',
                            onClick: () => navigate('/reports/attendance'),
                            iconBg: 'bg-teal-100',
                            iconColor: 'text-teal-600',
                        },
                    ].map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Financial Reports Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <BanknotesIcon className="h-6 w-6 text-yellow-600" />
                    <h2 className="text-2xl font-bold">{t('reports:sections.financial.title') || 'Financial Reports'}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: BanknotesIcon,
                            title: t('reports:sections.financial.receiving') || 'Receiving Report (रसीद रिपोर्ट)',
                            onClick: () => navigate('/reports/financial/receiving'),
                            iconBg: 'bg-yellow-100',
                            iconColor: 'text-yellow-600',
                        },
                        {
                            icon: BanknotesIcon,
                            title: t('reports:sections.financial.payment') || 'Payment Report (भुगतान रिपोर्ट)',
                            onClick: () => navigate('/reports/financial/payment'),
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
