import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { useCreateMillingLabor } from '@/hooks/useMillingLabor';
import { useAllPaddyMilling } from '@/hooks/usePaddyMilling';
import { useAllRiceMilling } from '@/hooks/useRiceMilling';
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
const millingLaborFormSchema = z.object({
    millingDate: z.string().min(1, {
        message: 'Please select a milling date.',
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

    // Use hooks to fetch all milling records
    const { paddyMilling, isLoading: isPaddyLoading } = useAllPaddyMilling();
    const { riceMilling, isLoading: isRiceLoading } = useAllRiceMilling();

    const isLoading = isPaddyLoading || isRiceLoading;

    // Generate date options for SearchableSelect
    const dateOptions = useMemo(() => {
        const paddyRecords = (paddyMilling || []).map(r => ({ ...r, type: 'paddy' }));
        const riceRecords = (riceMilling || []).map(r => ({ ...r, type: 'rice' }));

        // Combine and sort by date (most recent first)
        const allRecords = [...paddyRecords, ...riceRecords].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        return allRecords.map(record => {
            const dateStr = format(new Date(record.date), 'yyyy-MM-dd');
            const displayDate = format(new Date(record.date), 'dd-MM-yyyy');
            const typeLabel = record.type === 'paddy' ? 'धान' : 'चावल';
            const hopperGunny = record.hopperGunny || '0';

            return {
                value: record._id,
                label: displayDate,
                date: dateStr,
                hopperGunny: hopperGunny,
                record: record
            };
        });
    }, [paddyMilling, riceMilling]);

    // Initialize form
    const form = useForm({
        resolver: zodResolver(millingLaborFormSchema),
        defaultValues: {
            millingDate: '',
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

    // Handle date selection - auto-fill hopperGunnyCount
    const handleDateChange = useCallback((selectedValue) => {
        form.setValue('millingDate', selectedValue);

        const selectedOption = dateOptions.find(opt => opt.value === selectedValue);
        if (selectedOption && selectedOption.hopperGunny) {
            form.setValue('hopperGunnyCount', selectedOption.hopperGunny);
        } else {
            form.setValue('hopperGunnyCount', '');
        }
    }, [dateOptions, form]);

    // Form submission handler
    const handleConfirmedSubmit = (data) => {
        const selectedOption = dateOptions.find(opt => opt.value === data.millingDate);

        const formattedData = {
            date: selectedOption?.date || format(new Date(), 'yyyy-MM-dd'),
            hopperGunnyCount: parseFloat(data.hopperGunnyCount),
            hopperRate: parseFloat(data.hopperRate),
            laborTeam: data.laborTeam,
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
                <CardTitle>मिलिंग हमाली</CardTitle>
                <CardDescription>
                    Add milling labor cost details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Milling Date Dropdown */}
                        <FormField
                            control={form.control}
                            name="millingDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.common.date')} (मिलिंग तिथि)</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={dateOptions}
                                            value={field.value}
                                            onChange={handleDateChange}
                                            placeholder={isLoading ? "Loading dates..." : "Select milling date"}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Hopper Gunny Count (Auto-filled) */}
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
                                            className="placeholder:text-gray-400 bg-muted"
                                            readOnly
                                        />
                                    </FormControl>
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

                        {/* Total Amount (Calculated) */}
                        <div className="space-y-2 bg-muted p-4 rounded-lg">
                            <FormLabel className="text-base font-semibold">Total Amount (कुल राशि)</FormLabel>
                            <Input
                                type="text"
                                value={`₹ ${totalAmount}`}
                                readOnly
                                className="bg-background font-semibold text-lg"
                            />
                            <p className="text-xs text-muted-foreground">
                                = Hopper Gunny Count × Hopper Rate
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
