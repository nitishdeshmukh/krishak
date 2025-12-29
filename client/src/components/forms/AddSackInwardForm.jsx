import React, { useMemo, useEffect, useState } from 'react';
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
import { useCreateSackInward } from '@/hooks/useSackInward';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { useAllSackPurchases, useSackPurchaseByNumber } from '@/hooks/useSackPurchases';
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
const sackInwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    sackPurchaseNumber: z.string().min(1, {
        message: 'Please select sack purchase.',
    }),
    partyName: z.string().optional(),
    delivery: z.string().optional(),
    samitiSangrahan: z.string().optional(),
    gunnyNew: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyOld: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyPlastic: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddSackInwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createSackInward = useCreateSackInward();
    const [showSamitiField, setShowSamitiField] = useState(false);

    // Fetch data from API
    const { sackPurchases } = useAllSackPurchases();

    // Convert fetched data to options format
    const sackPurchaseOptions = useMemo(() =>
        sackPurchases.map(sp => ({
            value: sp.sackPurchaseNumber,
            label: sp.sackPurchaseNumber
        })),
        [sackPurchases]
    );

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(sackInwardFormSchema),
        defaultValues: {
            date: new Date(),
            sackPurchaseNumber: '',
            partyName: '',
            delivery: '',
            samitiSangrahan: '',
            gunnyNew: '',
            gunnyOld: '',
            gunnyPlastic: '',
        },
    });

    // Watch sackPurchaseNumber for auto-fetch
    const watchedSackPurchaseNumber = form.watch('sackPurchaseNumber');

    // Use hook to fetch purchase details
    const { purchaseDetails, isLoading: isLoadingDetails } = useSackPurchaseByNumber(watchedSackPurchaseNumber);

    // Update form fields when purchase details change
    useEffect(() => {
        if (!watchedSackPurchaseNumber) {
            form.setValue('partyName', '');
            form.setValue('delivery', '');
            form.setValue('samitiSangrahan', '');
            setShowSamitiField(false);
            return;
        }

        if (purchaseDetails) {
            const { partyName, delivery, samitiSangrahan } = purchaseDetails;
            form.setValue('partyName', partyName || '');
            form.setValue('delivery', delivery || '');
            form.setValue('samitiSangrahan', samitiSangrahan || '');
            setShowSamitiField(delivery === 'samiti-sangrahan');
        }
    }, [purchaseDetails, watchedSackPurchaseNumber, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
        };

        createSackInward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.sackInward.successMessage') || 'Sack Inward Added Successfully', {
                    description: `Inward for ${data.partyName} has been recorded.`,
                });
                form.reset();
                setShowSamitiField(false);
            },
            onError: (error) => {
                toast.error('Error creating Sack Inward', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'sack-inward',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.sackInward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.sackInward.description')}
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

                        {/* Sack Purchase Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="sackPurchaseNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.sackPurchaseNumber')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={sackPurchaseOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Party Name (Readonly - Auto-populated) */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.partyName')}</FormLabel>
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

                        {/* Delivery (Readonly - Auto-populated) */}
                        <FormField
                            control={form.control}
                            name="delivery"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.delivery')}</FormLabel>
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

                        {/* Samiti Sangrahan (Conditional - only shown when delivery === 'samiti-sangrahan') */}
                        {showSamitiField && (
                            <FormField
                                control={form.control}
                                name="samitiSangrahan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.sackInward.samitiSangrahan')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                readOnly
                                                className="bg-muted"
                                                placeholder="Auto-populated from sack purchase"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Gunny New */}
                        <FormField
                            control={form.control}
                            name="gunnyNew"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.gunnyNew')}</FormLabel>
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

                        {/* Gunny Old */}
                        <FormField
                            control={form.control}
                            name="gunnyOld"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.gunnyOld')}</FormLabel>
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

                        {/* Gunny Plastic */}
                        <FormField
                            control={form.control}
                            name="gunnyPlastic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.gunnyPlastic')}</FormLabel>
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

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createSackInward.isPending}
                            >
                                {createSackInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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

