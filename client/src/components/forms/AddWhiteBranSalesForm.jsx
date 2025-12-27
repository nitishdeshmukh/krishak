import React from 'react';
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
import { useCreateWhiteBranSales } from '@/hooks/useWhiteBranSales';
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
const whiteBranSalesFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    brokerName: z.string().min(1, {
        message: 'Please select a broker.',
    }),
    silkyKodhaQuantity: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    silkyKodhaRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    silkyKodhaAmount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gstPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gstAmount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    totalAmountWithGst: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    brokeragePerQuintal: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    brokerPayable: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    totalPayable: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddWhiteBranSalesForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createWhiteBranSales = useCreateWhiteBranSales();

    const partyOptions = [
        { value: 'पार्टी 1', label: 'पार्टी 1' },
        { value: 'पार्टी 2', label: 'पार्टी 2' },
        { value: 'पार्टी 3', label: 'पार्टी 3' },
    ];
    const brokerOptions = [
        { value: 'ब्रोकर 1', label: 'ब्रोकर 1' },
        { value: 'ब्रोकर 2', label: 'ब्रोकर 2' },
        { value: 'ब्रोकर 3', label: 'ब्रोकर 3' },
    ];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(whiteBranSalesFormSchema),
        defaultValues: {
            date: new Date(),
            partyName: '',
            brokerName: '',
            silkyKodhaQuantity: '',
            silkyKodhaRate: '',
            silkyKodhaAmount: '',
            gstPercent: '18',
            gstAmount: '',
            totalAmountWithGst: '',
            brokeragePerQuintal: '',
            brokerPayable: '',
            totalPayable: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['silkyKodhaQuantity', 'silkyKodhaRate', 'gstPercent', 'brokeragePerQuintal']);

    React.useEffect(() => {
        const [silkyKodhaQuantity, silkyKodhaRate, gstPercent, brokeragePerQuintal] = watchedFields;
        const qty = parseFloat(silkyKodhaQuantity) || 0;
        const rate = parseFloat(silkyKodhaRate) || 0;
        const gst = parseFloat(gstPercent) || 0;
        const brokerage = parseFloat(brokeragePerQuintal) || 0;

        // Calculate silky kodha amount
        const silkyKodhaAmount = qty * rate;

        // Calculate GST amount
        const gstAmount = (silkyKodhaAmount * gst) / 100;

        // Calculate total with GST
        const totalAmountWithGst = silkyKodhaAmount + gstAmount;

        // Calculate broker payable
        const brokerPayable = qty * brokerage;

        // Calculate total payable
        const totalPayable = totalAmountWithGst;

        if (silkyKodhaAmount > 0) {
            form.setValue('silkyKodhaAmount', silkyKodhaAmount.toFixed(2));
            form.setValue('gstAmount', gstAmount.toFixed(2));
            form.setValue('totalAmountWithGst', totalAmountWithGst.toFixed(2));
            form.setValue('brokerPayable', brokerPayable.toFixed(2));
            form.setValue('totalPayable', totalPayable.toFixed(2));
        }
    }, [watchedFields, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createWhiteBranSales.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.whiteBranSales.successMessage') || 'White Bran Sales Added Successfully', {
                    description: `Sale for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating White Bran Sales', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'white-bran-sales',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.whiteBranSales.title')}</CardTitle>
                <CardDescription>
                    {t('forms.whiteBranSales.description')}
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

                        {/* Party Name Dropdown */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.partyName')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={partyOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Broker Name Dropdown */}
                        <FormField
                            control={form.control}
                            name="brokerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.brokerName')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={brokerOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Silky Kodha Quantity (in Quintal) */}
                        <FormField
                            control={form.control}
                            name="silkyKodhaQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.silkyKodhaQuantity')}</FormLabel>
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

                        {/* Silky Kodha Rate */}
                        <FormField
                            control={form.control}
                            name="silkyKodhaRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.silkyKodhaRate')}</FormLabel>
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

                        {/* Silky Kodha Amount (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="silkyKodhaAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.silkyKodhaAmount')}</FormLabel>
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

                        {/* GST Percent */}
                        <FormField
                            control={form.control}
                            name="gstPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.gst')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="18"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* GST Amount (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="gstAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.gstAmount')}</FormLabel>
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

                        {/* Total Amount with GST (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="totalAmountWithGst"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.totalAmountWithGst')}</FormLabel>
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

                        {/* Brokerage Per Quintal */}
                        <FormField
                            control={form.control}
                            name="brokeragePerQuintal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.brokeragePerQuintal')}</FormLabel>
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

                        {/* Broker Payable (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="brokerPayable"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.brokerPayable')}</FormLabel>
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

                        {/* Total Payable (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="totalPayable"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranSales.totalPayable')}</FormLabel>
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

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createWhiteBranSales.isPending}
                            >
                                {createWhiteBranSales.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
