import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTransaction } from '@/hooks/useFinancialTransaction';
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
import { useAllParties } from '@/hooks/useParties';
import { useAllBrokers } from '@/hooks/useBrokers';
import { useAllSalesByType } from '@/hooks/useAllSalesByType';
import { saleDealTypes, paymentModeOptions } from '@/lib/constants';

const receiptSchema = z.object({
    date: z.date({ required_error: 'Date is required' }),
    partyId: z.string().min(1, 'Party is required'),
    brokerId: z.string().optional(),
    dealType: z.string().optional(),
    dealId: z.string().optional(),
    amount: z.string().min(1, 'Amount is required'),
    paymentMode: z.string().min(1, 'Payment Mode is required'),
    remarks: z.string().optional(),
});

export default function AddReceivingForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createTransaction = useCreateTransaction();

    // Data Hooks
    const { parties: partiesData } = useAllParties();
    const { brokers: brokersData } = useAllBrokers();

    const form = useForm({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            date: new Date(),
            transactionType: 'RECEIPT',
            paymentCategory: 'RECEIPT_DEAL',
            paymentMode: '',
            dealType: '',
            dealId: '',
            amount: '',
            remarks: '',
        },
    });

    // Watch dealType to fetch appropriate deals
    const selectedDealType = form.watch('dealType');

    // Fetch deals based on selected type
    const { sales, isLoading: isLoadingDeals } = useAllSalesByType(selectedDealType);

    // Convert data to options
    const partyOptions = React.useMemo(() =>
        (partiesData || []).map(p => ({ value: p._id, label: p.partyName })),
        [partiesData]
    );
    const brokerOptions = React.useMemo(() =>
        (brokersData || []).map(b => ({ value: b._id, label: b.brokerName })),
        [brokersData]
    );
    const dealOptions = React.useMemo(() =>
        (sales || []).map(s => ({
            value: s._id,
            label: s.dealNumber || s.saleNumber || `Deal-${s._id?.slice(-6)}`
        })),
        [sales]
    );

    // Reset dealId when dealType changes
    React.useEffect(() => {
        form.setValue('dealId', '');
    }, [selectedDealType, form]);

    const handleConfirmedSubmit = async (data) => {
        const payload = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
            amount: parseFloat(data.amount),
            transactionType: 'RECEIPT',
            paymentCategory: 'RECEIPT_DEAL',
        };

        // Remove empty optional ObjectId fields to prevent MongoDB cast errors
        const optionalIdFields = ['partyId', 'brokerId', 'dealId'];
        optionalIdFields.forEach(field => {
            if (!payload[field]) delete payload[field];
        });

        // Remove empty optional string fields
        const optionalStringFields = ['dealType', 'remarks'];
        optionalStringFields.forEach(field => {
            if (!payload[field]) delete payload[field];
        });

        try {
            await createTransaction.mutateAsync(payload);
            toast.success(t('forms.receiving.successMessage'));
            form.reset({
                date: new Date(),
                paymentMode: '',
                dealType: '',
                amount: '',
                remarks: '',
            });
        } catch (e) {
            toast.error(e.message);
        }
    };

    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog('receipt-save', handleConfirmedSubmit);

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.receiving.title')}</CardTitle>
                <CardDescription>{t('forms.receiving.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(openDialog)} className="space-y-6">
                        <DatePickerField name="date" label={t('forms.common.date')} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="partyId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.receiving.party')} *</FormLabel>
                                        <FormControl>
                                            <SearchableSelect
                                                options={partyOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={t('forms.common.selectPlaceholder')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="brokerId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.receiving.broker')}</FormLabel>
                                        <FormControl>
                                            <SearchableSelect
                                                options={brokerOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={t('forms.common.selectPlaceholder')}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dealType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.receiving.dealType')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="सौदा प्रकार चुनें" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {saleDealTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.labelHi}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dealId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.receiving.dealNumber')}</FormLabel>
                                        <FormControl>
                                            <SearchableSelect
                                                options={dealOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={isLoadingDeals ? "Loading..." : "सौदा नंबर चुनें"}
                                                disabled={!selectedDealType || isLoadingDeals}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.receiving.amount')} (₹) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                className="text-lg font-semibold"
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentMode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.receiving.paymentMode')} *</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="भुगतान मोड चुनें" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {paymentModeOptions.map((mode) => (
                                                    <SelectItem key={mode.value} value={mode.value}>
                                                        {mode.labelHi || mode.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="remarks"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.receiving.remarks')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter any details..."
                                            className="placeholder:text-muted-foreground/60"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full md:w-auto"
                            disabled={createTransaction.isPending}
                        >
                            {createTransaction.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                        </Button>
                    </form>
                </Form>

                <AlertDialog open={isOpen} onOpenChange={closeDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('forms.common.confirmTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('forms.common.confirmMessage')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('forms.common.confirmNo')}</AlertDialogCancel>
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
