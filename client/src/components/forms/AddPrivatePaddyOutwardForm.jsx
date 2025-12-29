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
import { useCreatePrivatePaddyOutward } from '@/hooks/usePrivatePaddyOutward';
import { useAllPaddySales, usePaddySaleBySaleNumber } from '@/hooks/usePaddySales';
import { paddyTypeOptions } from '@/lib/constants';
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
const privatePaddyOutwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    paddySaleNumber: z.string().min(1, {
        message: 'Please select paddy sale.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    brokerName: z.string().min(1, {
        message: 'Please select a broker.',
    }),
    paddyType: z.enum(['mota', 'patla', 'sarna', 'mahamaya', 'rbgold'], {
        required_error: 'Please select paddy type.',
    }),
    saleQuantity: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyNew: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyOld: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyPlastic: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    juteWeight: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    plasticWeight: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    truckNo: z.string().min(1, {
        message: 'Truck number is required.',
    }),
    rstNo: z.string().optional(),
    truckWeight: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddPrivatePaddyOutwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createPrivatePaddyOutward = useCreatePrivatePaddyOutward();
    const [selectedSaleNumber, setSelectedSaleNumber] = useState('');

    // Fetch all paddy sales for dropdown
    const { paddySales } = useAllPaddySales();

    // Fetch sale details when a sale number is selected
    const { saleDetails, isFetching: isFetchingSaleDetails } = usePaddySaleBySaleNumber(selectedSaleNumber);

    // Convert to options format
    const paddySaleOptions = useMemo(() =>
        paddySales.map(sale => ({ value: sale.dealNumber, label: sale.dealNumber })),
        [paddySales]
    );

    // Map paddyTypeOptions from constants to form enum values
    const paddyTypeOptionsFormatted = useMemo(() => {
        // Create a mapping from Hindi labels to enum values
        const labelToEnumMap = {
            'धान(मोटा)': 'mota',
            'धान(पतला)': 'patla',
            'धान(सरना)': 'sarna',
            'धान(महामाया)': 'mahamaya',
            'धान(RB GOLD)': 'rbgold',
        };

        return paddyTypeOptions.map(option => ({
            value: labelToEnumMap[option.value] || option.value,
            label: option.label,
        }));
    }, []);
    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(privatePaddyOutwardFormSchema),
        defaultValues: {
            date: new Date(),
            paddySaleNumber: '',
            partyName: '',
            brokerName: '',
            paddyType: '',
            saleQuantity: '',
            gunnyNew: '',
            gunnyOld: '',
            gunnyPlastic: '',
            juteWeight: '0.58',
            plasticWeight: '0.135',
            truckNo: '',
            rstNo: '',
            truckWeight: '',
        },
    });

    // Handle paddy sale number change
    const handleSaleNumberChange = useCallback((saleNumber) => {
        setSelectedSaleNumber(saleNumber);
        form.setValue('paddySaleNumber', saleNumber);

        if (!saleNumber) {
            // Clear related fields if no sale number selected
            form.setValue('partyName', '');
            form.setValue('brokerName', '');
            form.setValue('paddyType', '');
        }
    }, [form]);

    // Auto-fill fields when sale details are fetched
    useEffect(() => {
        if (saleDetails && selectedSaleNumber) {
            const { partyName, brokerName, paddyType } = saleDetails;

            // Auto-fill the fields
            if (partyName) form.setValue('partyName', partyName);
            if (brokerName) form.setValue('brokerName', brokerName);

            // Map paddyType from backend to form enum value
            if (paddyType) {
                // Convert from display format to enum format
                const typeMap = {
                    'धान(मोटा)': 'mota',
                    'धान(पतला)': 'patla',
                    'धान(सरना)': 'sarna',
                    'धान(महामाया)': 'mahamaya',
                    'धान(RB GOLD)': 'rbgold',
                };

                const mappedType = typeMap[paddyType] || '';
                if (mappedType) {
                    form.setValue('paddyType', mappedType);
                }
            }
        }
    }, [saleDetails, selectedSaleNumber, form]);



    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
        };

        createPrivatePaddyOutward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.privatePaddyOutward.successMessage') || 'Private Paddy Outward Added Successfully', {
                    description: `Outward for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Private Paddy Outward', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'private-paddy-outward',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.privatePaddyOutward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.privatePaddyOutward.description')}
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

                        {/* Paddy Sale Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="paddySaleNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.paddySaleNumber')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={paddySaleOptions}
                                            value={field.value}
                                            onChange={handleSaleNumberChange}
                                            placeholder="Select"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Party Name (Auto-filled from Paddy Sale) */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.partyName')}</FormLabel>
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

                        {/* Broker Name (Auto-filled from Paddy Sale) */}
                        <FormField
                            control={form.control}
                            name="brokerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.brokerName')}</FormLabel>
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

                        {/* Paddy Type (Auto-filled from Paddy Sale) */}
                        <FormField
                            control={form.control}
                            name="paddyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.paddyType')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={paddyTypeOptionsFormatted}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Sale Quantity */}
                        <FormField
                            control={form.control}
                            name="saleQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.saleQuantity')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Gunny New */}
                        <FormField
                            control={form.control}
                            name="gunnyNew"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.gunnyNew')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Gunny Old */}
                        <FormField
                            control={form.control}
                            name="gunnyOld"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.gunnyOld')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Gunny Plastic */}
                        <FormField
                            control={form.control}
                            name="gunnyPlastic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.gunnyPlastic')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Jute Weight */}
                        <FormField
                            control={form.control}
                            name="juteWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.juteWeight')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Plastic Weight */}
                        <FormField
                            control={form.control}
                            name="plasticWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.plasticWeight')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
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
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.truckNo')}</FormLabel>
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

                        {/* RST Number */}
                        <FormField
                            control={form.control}
                            name="rstNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.rstNo')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="RST-001"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Truck Weight */}
                        <FormField
                            control={form.control}
                            name="truckWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privatePaddyOutward.truckWeight')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
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
                                disabled={createPrivatePaddyOutward.isPending}
                            >
                                {createPrivatePaddyOutward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
