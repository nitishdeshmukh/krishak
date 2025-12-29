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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateOtherLabor } from '@/hooks/useOtherLabor';
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
const otherLaborFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    laborType: z.enum(['pala_bharai', 'kota', 'silai', 'other'], {
        required_error: 'Please select labor type.',
    }),
    laborTeam: z.string().min(1, {
        message: 'Labor team name is required.',
    }),
    gunnyCount: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    rate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    detail: z.string().optional(),
    totalAmount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
});

export default function AddOtherLaborForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createOtherLabor = useCreateOtherLabor();
    const [selectedLaborType, setSelectedLaborType] = useState('');

    // Initialize form
    const form = useForm({
        resolver: zodResolver(otherLaborFormSchema),
        defaultValues: {
            date: new Date(),
            laborType: '',
            laborTeam: '',
            gunnyCount: '0',
            rate: '',
            detail: '',
            totalAmount: '',
        },
    });

    // Watch rate field for auto-setting total amount
    const rate = form.watch('rate');

    // Auto-set total amount from rate for pala_bharai, kota, silai
    useEffect(() => {
        if (['pala_bharai', 'kota', 'silai'].includes(selectedLaborType) && rate) {
            form.setValue('totalAmount', rate);
        }
    }, [rate, selectedLaborType, form]);

    // Handle labor type change
    const handleLaborTypeChange = useCallback((type) => {
        setSelectedLaborType(type);
        form.setValue('laborType', type);

        // Reset conditional fields
        form.setValue('gunnyCount', '0');
        form.setValue('rate', '');
        form.setValue('detail', '');
        form.setValue('totalAmount', '');
    }, [form]);

    // Form submission handler
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
            gunnyCount: data.gunnyCount ? parseInt(data.gunnyCount) : 0,
            rate: data.rate ? parseFloat(data.rate) : 0,
            totalAmount: parseFloat(data.totalAmount),
        };

        createOtherLabor.mutate(formattedData, {
            onSuccess: () => {
                toast.success('Other Labor Added Successfully', {
                    description: `Labor record for ${data.laborTeam} has been created.`,
                });
                form.reset();
                setSelectedLaborType('');
            },
            onError: (error) => {
                toast.error('Error creating Other Labor', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'other-labor',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>अन्य हमाली (Other Labor)</CardTitle>
                <CardDescription>
                    Add other labor cost details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Date */}
                        <DatePickerField
                            name="date"
                            label={t('forms.common.date')}
                        />

                        {/* Labor Type Radio */}
                        <FormField
                            control={form.control}
                            name="laborType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base">Labor Type (हमाली प्रकार)</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={handleLaborTypeChange}
                                            value={selectedLaborType}
                                            className="flex flex-col space-y-2"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="pala_bharai" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Pala Bharai (पाला भराई)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="kota" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Kota (कोटा)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="silai" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Silai (सिलाई)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="other" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Other (अन्य)
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Labor Team (Always Visible) */}
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

                        {/* Conditional Fields for Pala Bharai/Kota/Silai */}
                        {['pala_bharai', 'kota', 'silai'].includes(selectedLaborType) && (
                            <>
                                {/* Rate (which becomes total amount) */}
                                <FormField
                                    control={form.control}
                                    name="rate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Rate/Amount (हमाली दर)</FormLabel>
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
                                                This will be set as the total amount (No gunny count)
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Conditional Fields for Other */}
                        {selectedLaborType === 'other' && (
                            <>
                                {/* Detail/Description */}
                                <FormField
                                    control={form.control}
                                    name="detail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Work Detail (काम का विवरण)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the work..."
                                                    {...field}
                                                    className="placeholder:text-gray-400"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Total Amount (Manual Entry) */}
                                <FormField
                                    control={form.control}
                                    name="totalAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Total Amount (कुल राशि)</FormLabel>
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
                            </>
                        )}

                        {/* Auto-calculated Total Amount Display (for pala_bharai, kota, silai) */}
                        {['pala_bharai', 'kota', 'silai'].includes(selectedLaborType) && (
                            <div className="space-y-2 bg-muted p-4 rounded-lg">
                                <FormLabel className="text-base font-semibold">Total Amount</FormLabel>
                                <Input
                                    type="text"
                                    value={form.watch('totalAmount') || '0.00'}
                                    readOnly
                                    className="bg-background font-semibold text-lg"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Auto-set from rate (no gunny count applicable)
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createOtherLabor.isPending || !selectedLaborType}
                            >
                                {createOtherLabor.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
