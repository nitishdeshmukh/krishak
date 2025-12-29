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
} from '@heroicons/react/24/outline';
import DashboardCard from '@/components/DashboardCard';

export default function EntryReportPage() {
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
            icon: CurrencyDollarIcon,
            title: t('reports:sections.sales.paddy'),
            onClick: () => navigate('/reports/sales/paddy'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
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
    ];

    return (
        <div className="space-y-8">
            {/* Entry Reports Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('reports:sections.entry.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {entryReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Purchase Deal Reports Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('reports:sections.purchase.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {purchaseReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Inward Reports Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('reports:sections.inward.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inwardReportCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Labor Cost Reports Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('reports:sections.laborCost.title') || 'Labor Cost Reports'}</h2>
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
                <h2 className="text-2xl font-bold mb-4">{t('reports:sections.attendance.title') || 'Attendance Reports'}</h2>
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
        </div>
    );
}