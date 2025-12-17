import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';

export default function PartyInfo() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Mock data for party information
    const [parties, setParties] = React.useState([
        {
            id: '1',
            partyName: 'Xyz',
            phone: '+919894397029',
            email: '',
            address: 'Quzi',
            gstn: '',
        },
        {
            id: '2',
            partyName: 'Ram Janki',
            phone: '+919990759995',
            email: '',
            address: 'utai',
            gstn: '',
        },
        {
            id: '3',
            partyName: 'sarguni industries',
            phone: '+919188398154B4',
            email: '',
            address: 'utai, india',
            gstn: '',
        },
        {
            id: '4',
            partyName: 'PARTY 3',
            phone: '',
            email: '',
            address: '',
            gstn: '',
        },
        {
            id: '5',
            partyName: 'PARTY 2',
            phone: '',
            email: '',
            address: '',
            gstn: '',
        },
        {
            id: '6',
            partyName: 'PARTY 1',
            phone: '',
            email: '',
            address: '',
            gstn: '',
        },
    ]);

    const [isLoading, setIsLoading] = React.useState(false);
    const totalPages = Math.ceil(parties.length / pageSize);
    const currentPage = pageIndex + 1;

    // Paginated data
    const paginatedParties = React.useMemo(() => {
        const startIdx = pageIndex * pageSize;
        const endIdx = startIdx + pageSize;
        return parties.slice(startIdx, endIdx);
    }, [parties, pageIndex, pageSize]);

    // Table column definitions with translations
    const columns = [
        {
            accessorKey: 'partyName',
            header: 'पार्टी का नाम',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('partyName')}</div>
            ),
        },
        {
            accessorKey: 'phone',
            header: 'फोन न.',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const phone = row.getValue('phone');
                return phone ? (
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600">{phone}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const email = row.getValue('email');
                return email ? (
                    <div className="text-sm">{email}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'address',
            header: 'पता',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const address = row.getValue('address');
                return address ? (
                    <div className="text-sm">{address}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'gstn',
            header: 'GSTN',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const gstn = row.getValue('gstn');
                return gstn ? (
                    <div className="text-sm font-mono">{gstn}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            id: 'actions',
            header: t('common:actions'),
            enableColumnFilter: false,
            cell: ({ row }) => {
                const party = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(party)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(party)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(party)}
                                className="text-destructive"
                            >
                                <TrashIcon className="mr-2 h-4 w-4" />
                                {t('common:delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleView = (party) => {
        toast.info('View Party', {
            description: `Viewing details for ${party.partyName}`,
        });
    };

    const handleEdit = (party) => {
        toast.info('Edit Party', {
            description: `Editing ${party.partyName}`,
        });
    };

    const handleDelete = (party) => {
        toast.error('Delete Party', {
            description: `Are you sure you want to delete ${party.partyName}?`,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading party information...</p>
                </div>
            </div>
        );
    }

    // Empty state - no parties
    if (!isLoading && parties.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई पार्टी नहीं जोड़ी है!"
                description="नई पार्टी जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="पार्टी जोड़ें"
                addRoute="/entry/party"
                icon={UserGroupIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={paginatedParties}
                        showFilters={true}
                    />

                    <TablePagination
                        pageIndex={pageIndex}
                        pageCount={totalPages}
                        pageSize={pageSize}
                        setPageIndex={(index) => dispatch(setPageIndex(index))}
                        setPageSize={(size) => dispatch(setPageSize(size))}
                        canPreviousPage={currentPage > 1}
                        canNextPage={currentPage < totalPages}
                        previousPage={() => dispatch(setPageIndex(Math.max(0, pageIndex - 1)))}
                        nextPage={() => dispatch(setPageIndex(pageIndex + 1))}
                        paginationItemsToDisplay={5}
                    />
                </CardContent>
            </Card>
        </div>
    );
}