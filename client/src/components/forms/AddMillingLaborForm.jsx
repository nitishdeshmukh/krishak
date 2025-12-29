import React, { useState, useCallback, useEffect } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateMillingLabor } from '@/hooks/useMillingLabor';
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

// Import API to fetch milling records by date
import { fetchPaddyMilling } from '@/api/paddyMillingApi';
import { fetchRiceMilling } from '@/api/riceMillingApi';

// Form validation schema
const millingLaborFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    hopperGunnyCount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
    hopperRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
    laborTeam: z.string().min(1, {
        message: 'Labor team name is required.',
    }),
});

export default function AddMillingLaborForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createMillingLabor = useCreateMillingLabor();
    const [totalAmount, setTotalAmount] = useState('0.00');

    // Initialize form
    const form = useForm({
        resolver: zodResolver(millingLaborFormSchema),
        defaultValues: {
            date: new Date(),
            hopperGunnyCount: '',
            hopperRate: '',
            laborTeam: '',
        },
    });

    // Watch fields for auto-calculation
    const [hopperGunnyCount, hopperRate] = form.watch(['hopperGunnyCount', 'hopperRate']);

    // Calculate total amount
    useEffect(() => {
        const gunny = parseFloat(hopperGunnyCount) || 0;
        const rate = parseFloat(hopperRate) || 0;
        const total = gunny * rate;
        setTotalAmount(total.toFixed(2));
    }, [hopperGunnyCount, hopperRate]);

    // Lookup hopper gunny count when date changes
    const handleDateChange = useCallback(async (date) => {
        if (!date) return;

        try {
            // Try to fetch milling records for the selected date
            const formattedDate = format(date, 'yyyy-MM-dd');

            // Try paddy milling first
            let response = await fetchPaddyMilling({
                page: 1,
                pageSize: 100,
                filters: [{ id: 'date', value: formattedDate }]
            });

            let millingRecords = response?.data?.paddyMilling || [];

            // If no paddy milling, try rice milling
            if (millingRecords.length === 0) {
                response = await fetchRiceMilling({
                    page: 1,
                    pageSize: 100,
                    filters: [{ id: 'date', value: formattedDate }]
                });
                millingRecords = response?.data?.riceMilling || [];
            }

            // Find record for the selected date and extract hopper gunny count
            const record = millingRecords.find(r => {
                const recordDate = format(new Date(r.date), 'yyyy-MM-dd');
                return recordDate === formattedDate;
            });

            if (record && record.hopperGunnyCount) {
                form.setValue('hopperGunnyCount', record.hopperGunnyCount.toString());
                toast.success('Hopper Gunny Count found for selected date');
            } else {
                form.setValue('hopperGunnyCount', '');
                toast.info('No milling record found for this date. Please enter manually.');
            }
        } catch (error) {
            console.error('Error fetching milling records:', error);
            form.setValue('hopperGunnyCount', '');
            toast.warning('Could not lookup milling data. Please enter manually.');
        }
    }, [form]);

    // Form submission handler
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
            hopperGunnyCount: parseFloat(data.hopperGunnyCount),
            hopperRate: parseFloat(data.hopperRate),
            totalAmount: parseFloat(totalAmount),
        };

        createMillingLabor.mutate(formattedData, {
            onSuccess: () => {
                toast.success('Milling Labor Added Successfully', {
                    description: `Labor record for ${data.laborTeam} has been created.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Milling Labor', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'milling-labor',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>मिलिंग हमाली (Milling Labor)</CardTitle>
                <CardDescription>
                    Add milling labor cost details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Date with Lookup */}
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.common.date')}</FormLabel>
                                    <FormControl>
                                        <DatePickerField
                                            name="date"
                                            label=""
                                            onChange={(date) => {
                                                field.onChange(date);
                                                handleDateChange(date);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Hopper Gunny Count (Lookup from Milling) */}
                        <FormField
                            control={form.control}
                            name="hopperGunnyCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Hopper Gunny Count (हॉपर कटाई)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Auto-filled from milling records if available
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Hopper Rate */}
                        <FormField
                            control={form.control}
                            name="hopperRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Hopper Rate (हॉपर दर)</FormLabel>
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

                        {/* Labor Team */}
                        <FormField
                            control={form.control}
                            name="laborTeam"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Labor Team (हमाल/रेजा टोली)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter labor team name"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Total Amount (Read-only) */}
                        <div className="space-y-2 bg-muted p-4 rounded-lg">
                            <FormLabel className="text-base font-semibold">Total Amount</FormLabel>
                            <Input
                                type="text"
                                value={totalAmount}
                                readOnly
                                className="bg-background font-semibold text-lg"
                            />
                            <p className="text-xs text-muted-foreground">
                                Calculated as: Hopper Gunny Count × Hopper Rate
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createMillingLabor.isPending}
                            >
                                {createMillingLabor.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
