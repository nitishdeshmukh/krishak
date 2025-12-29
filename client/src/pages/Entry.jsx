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
} from '@heroicons/react/24/outline';
import DashboardCard from '@/components/DashboardCard';

export default function EntryPage() {
    const { t } = useTranslation(['entry']);
    const navigate = useNavigate();

    // Management cards configuration
    const managementCards = [
        {
            icon: UserPlusIcon,
            title: t('entry:entry.management.addParty'),
            onClick: () => navigate('/entry/party'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: TruckIcon,
            title: t('entry:entry.management.addTransporter'),
            onClick: () => navigate('/entry/transporters'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: UserGroupIcon,
            title: t('entry:entry.management.addWorker'),
            onClick: () => navigate('/entry/brokers'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: BuildingOffice2Icon,
            title: t('entry:entry.management.propertyManagement'),
            onClick: () => navigate('/entry/committee'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: DocumentTextIcon,
            title: t('entry:entry.management.doEntry'),
            onClick: () => navigate('/entry/do'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: TruckIcon,
            title: t('entry:entry.management.addTruck'),
            onClick: () => navigate('/entry/trucks'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
        {
            icon: UserGroupIcon,
            title: t('entry:entry.management.addStaff'),
            onClick: () => navigate('/entry/staff'),
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
        },
    ];

    // Purchase deals cards configuration
    const purchaseCards = [
        {
            icon: ShoppingBagIcon,
            title: t('entry:entry.purchaseDeals.paddyPurchase'),
            onClick: () => navigate('/purchase/paddy'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: ShoppingBagIcon,
            title: t('entry:entry.purchaseDeals.ricePurchase'),
            onClick: () => navigate('/purchase/rice'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            icon: CurrencyDollarIcon,
            title: t('entry:entry.purchaseDeals.paddySales'),
            onClick: () => navigate('/sales/paddy'),
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
    ];

    // Inward cards configuration
    const inwardCards = [
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:entry.inward.govtPaddy'),
            onClick: () => navigate('/inward/govt-paddy'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:entry.inward.privatePaddy'),
            onClick: () => navigate('/inward/private-paddy'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
        {
            icon: ArrowDownTrayIcon,
            title: t('entry:entry.inward.riceInward'),
            onClick: () => navigate('/inward/rice'),
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Management Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('entry:entry.management.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {managementCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Purchase Deals Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('entry:entry.purchaseDeals.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {purchaseCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Inward Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('entry:entry.inward.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inwardCards.map((card, index) => (
                        <DashboardCard key={index} {...card} />
                    ))}
                </div>
            </section>

            {/* Labor Cost Section */}
            <section>
                <h2 className="text-2xl font-bold mb-4">{t('entry:entry.laborCost.title')}</h2>
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
                <h2 className="text-2xl font-bold mb-4">{t('entry:entry.attendance.title')}</h2>
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
        </div>
    );
}
