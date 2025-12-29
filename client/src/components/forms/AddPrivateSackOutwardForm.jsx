import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreatePrivateSackOutward } from '@/hooks/usePrivateSackOutward';
import { useAllSackSales, useSackSaleByDealNumber } from '@/hooks/useSackSales';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Form validation schema
const privateSackOutwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    sackSaleNumber: z.string().min(1, {
        message: 'Please select sack sale.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    newGunnyQty: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    oldGunnyQty: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    plasticGunnyQty: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    truckNo: z.string().min(1, {
        message: 'Truck number is required.',
    }),
});

export default function AddPrivateSackOutwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createPrivateSackOutward = useCreatePrivateSackOutward();
    const [selectedDealNumber, setSelectedDealNumber] = useState('');

    // Fetch all sack sales for dropdown
    const { sackSales } = useAllSackSales();

    // Fetch sale details when a deal number is selected
    const { saleDetails, isFetching: isFetchingSaleDetails } = useSackSaleByDealNumber(selectedDealNumber);

    // Convert to options format
    const sackSaleOptions = useMemo(() =>
        sackSales.map(sale => ({ value: sale.dealNumber, label: sale.dealNumber })),
        [sackSales]
    );

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(privateSackOutwardFormSchema),
        defaultValues: {
            date: new Date(),
            sackSaleNumber: '',
            partyName: '',
            newGunnyQty: '',
            oldGunnyQty: '',
            plasticGunnyQty: '',
            truckNo: '',
        },
    });

    // Handle sack deal number change
    const handleDealNumberChange = useCallback((dealNumber) => {
        setSelectedDealNumber(dealNumber);
        form.setValue('sackSaleNumber', dealNumber);

        if (!dealNumber) {
            // Clear related fields if no deal number selected
            form.setValue('partyName', '');
        }
    }, [form]);

    // Auto-fill fields when sale details are fetched
    useEffect(() => {
        if (saleDetails && selectedDealNumber) {
            const { partyName } = saleDetails;

            // Auto-fill the party field
            if (partyName) form.setValue('partyName', partyName);
        }
    }, [saleDetails, selectedDealNumber, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
        };

        createPrivateSackOutward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.privateSackOutward.successMessage') || 'Private Sack Outward Added Successfully', {
                    description: `Outward for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Private Sack Outward', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'private-sack-outward',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.privateSackOutward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.privateSackOutward.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Date with Calendar */}
                        <DatePickerField
                            name="date"
                            label={t('forms.common.date')}
                        />

                        {/* Sack Sale Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="sackSaleNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.sackSaleNumber')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={sackSaleOptions}
                                            value={field.value}
                                            onChange={handleDealNumberChange}
                                            placeholder="Select"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Party Name (Auto-filled from Sack Purchase) */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.partyName')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            readOnly
                                            className="bg-muted"
                                            placeholder=""
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* New Gunny Quantity */}
                        <FormField
                            control={form.control}
                            name="newGunnyQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.newGunnyQty')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Old Gunny Quantity */}
                        <FormField
                            control={form.control}
                            name="oldGunnyQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.oldGunnyQty')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Plastic Gunny Quantity */}
                        <FormField
                            control={form.control}
                            name="plasticGunnyQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.plasticGunnyQty')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="1"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Truck Number */}
                        <FormField
                            control={form.control}
                            name="truckNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.truckNo')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="MH12AB1234"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createPrivateSackOutward.isPending}
                            >
                                {createPrivateSackOutward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>

                {/* Confirmation Dialog */}
                <AlertDialog open={isOpen} onOpenChange={closeDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('forms.common.confirmTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('forms.common.confirmMessage')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                {t('forms.common.confirmNo')}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm}>
                                {t('forms.common.confirmYes')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
