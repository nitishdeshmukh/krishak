import React, { useMemo } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCreateOtherSales } from '@/hooks/useOtherSales';
import { useAllParties } from '@/hooks/useParties';
import { useAllBrokers } from '@/hooks/useBrokers';
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
const otherSalesFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    brokerName: z.string().min(1, {
        message: 'Please select a broker.',
    }),
    itemName: z.string().min(1, {
        message: 'Please enter item name.',
    }),
    quantity: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    quantityType: z.string().min(1, {
        message: 'Please select quantity type.',
    }),
    rate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gstPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    totalAmountWithGst: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    discountPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    brokeragePerUnit: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddOtherSalesForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createOtherSale = useCreateOtherSales();

    // Fetch parties and brokers from server
    const { parties, isLoading: partiesLoading } = useAllParties();
    const { brokers, isLoading: brokersLoading } = useAllBrokers();

    // Convert to options format for SearchableSelect
    const partyOptions = useMemo(() =>
        parties.map(party => ({ value: party.partyName, label: party.partyName })),
        [parties]
    );

    const brokerOptions = useMemo(() =>
        brokers.map(broker => ({ value: broker.brokerName, label: broker.brokerName })),
        [brokers]
    );

    // Quantity type options
    const quantityTypeOptions = [
        { value: 'kg', label: t('forms.otherSales.quantityTypes.kg') || 'कि.ग्रा.' },
        { value: 'quintal', label: t('forms.otherSales.quantityTypes.quintal') || 'क्विंटल' },
        { value: 'ton', label: t('forms.otherSales.quantityTypes.ton') || 'टन' },
        { value: 'piece', label: t('forms.otherSales.quantityTypes.piece') || 'नग' },
    ];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(otherSalesFormSchema),
        defaultValues: {
            date: new Date(),
            partyName: '',
            brokerName: '',
            itemName: '',
            quantity: '',
            quantityType: '',
            rate: '',
            gstPercent: '18',
            totalAmountWithGst: '',
            discountPercent: '',
            brokeragePerUnit: '',
        },
    });



    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createOtherSale.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.otherSales.successMessage') || 'Other Sales Added Successfully', {
                    description: `Sale for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Other Sales', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'other-sales',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.otherSales.title')}</CardTitle>
                <CardDescription>
                    {t('forms.otherSales.description')}
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
                                    <FormLabel className="text-base">{t('forms.otherSales.partyName')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherSales.brokerName')}</FormLabel>
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

                        {/* Item Name (Text Input) */}
                        <FormField
                            control={form.control}
                            name="itemName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.itemName')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder={t('forms.otherSales.itemNamePlaceholder') || 'अन्य वस्तु प्रविष्ट करें'}
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Quantity */}
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.quantity')}</FormLabel>
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

                        {/* Quantity Type (Radio) */}
                        <FormField
                            control={form.control}
                            name="quantityType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.quantityType')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex flex-wrap gap-4"
                                        >
                                            {quantityTypeOptions.map((type) => (
                                                <div key={type.value} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={type.value} id={type.value} />
                                                    <Label htmlFor={type.value}>{type.label}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Rate */}
                        <FormField
                            control={form.control}
                            name="rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.rate')}</FormLabel>
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

                        {/* GST Percent */}
                        <FormField
                            control={form.control}
                            name="gstPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.gst')}</FormLabel>
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


                        {/* Total Amount with GST (Editable) */}
                        <FormField
                            control={form.control}
                            name="totalAmountWithGst"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.totalAmountWithGst')}</FormLabel>
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

                        {/* Discount Percent */}
                        <FormField
                            control={form.control}
                            name="discountPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.discountPercent')}</FormLabel>
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


                        {/* Brokerage Per Unit */}
                        <FormField
                            control={form.control}
                            name="brokeragePerUnit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherSales.brokeragePerUnit')}</FormLabel>
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
                                disabled={createOtherSale.isPending}
                            >
                                {createOtherSale.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
