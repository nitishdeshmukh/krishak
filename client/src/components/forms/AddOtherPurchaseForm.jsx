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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateOtherPurchase } from '@/hooks/useOtherPurchases';

// Form validation schema
const otherPurchaseFormSchema = z.object({
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
    quantityType: z.enum(['quintal', 'kg', 'piece', 'other'], {
        required_error: 'Please select quantity type.',
    }),
    rate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    amount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gstPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gstAmount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    totalWithGst: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    discountPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    discountAmount: z.string().regex(/^\d*\.?\d*$/, {
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

export default function AddOtherPurchaseForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createOtherPurchase = useCreateOtherPurchase();

    // Sample data - Replace with actual data from API
    const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
    const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(otherPurchaseFormSchema),
        defaultValues: {
            date: new Date(),
            partyName: '',
            brokerName: '',
            itemName: '',
            quantity: '',
            quantityType: 'quintal',
            rate: '',
            amount: '',
            gstPercent: '18',
            gstAmount: '',
            totalWithGst: '',
            discountPercent: '',
            discountAmount: '',
            brokeragePerQuintal: '',
            brokerPayable: '',
            totalPayable: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['quantity', 'rate', 'gstPercent', 'discountPercent', 'brokeragePerQuintal']);

    React.useEffect(() => {
        const [quantity, rate, gstPercent, discountPercent, brokeragePerQuintal] = watchedFields;
        const qty = parseFloat(quantity) || 0;
        const rt = parseFloat(rate) || 0;
        const gst = parseFloat(gstPercent) || 0;
        const discount = parseFloat(discountPercent) || 0;
        const brokerage = parseFloat(brokeragePerQuintal) || 0;

        // Calculate amount
        const amount = qty * rt;

        // Calculate GST
        const gstAmount = (amount * gst) / 100;

        // Calculate total with GST
        const totalWithGst = amount + gstAmount;

        // Calculate discount
        const discountAmount = (totalWithGst * discount) / 100;

        // Calculate broker payable
        const brokerPayable = qty * brokerage;

        // Calculate total payable (totalWithGst - discount)
        const totalPayable = totalWithGst - discountAmount;

        if (amount > 0 || gstAmount > 0 || totalWithGst > 0) {
            form.setValue('amount', amount.toFixed(2));
            form.setValue('gstAmount', gstAmount.toFixed(2));
            form.setValue('totalWithGst', totalWithGst.toFixed(2));
            form.setValue('discountAmount', discountAmount.toFixed(2));
            form.setValue('brokerPayable', brokerPayable.toFixed(2));
            form.setValue('totalPayable', totalPayable.toFixed(2));
        }
    }, [watchedFields, form]);

    // Form submission handler
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createOtherPurchase.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.otherPurchase.successMessage') || 'Other Purchase Added Successfully', {
                    description: `Purchase for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Other Purchase', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.otherPurchase.title')}</CardTitle>
                <CardDescription>
                    {t('forms.otherPurchase.description')}
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.partyName')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {parties.map((party) => (
                                                <SelectItem key={party} value={party}>
                                                    {party}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.brokerName')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {brokers.map((broker) => (
                                                <SelectItem key={broker} value={broker}>
                                                    {broker}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Item Name */}
                        <FormField
                            control={form.control}
                            name="itemName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherPurchase.itemName')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="अन्य वस्तु प्रविष्ट करें"
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.quantity')}</FormLabel>
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

                        {/* Quantity Type Radio */}
                        <FormField
                            control={form.control}
                            name="quantityType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherPurchase.quantityType')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-wrap items-center gap-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="quintal" id="quintal" />
                                                <Label htmlFor="quintal" className="font-normal cursor-pointer">
                                                    क्विंटल
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="kg" id="kg" />
                                                <Label htmlFor="kg" className="font-normal cursor-pointer">
                                                    किलोग्राम
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="piece" id="piece" />
                                                <Label htmlFor="piece" className="font-normal cursor-pointer">
                                                    नग
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="other" id="other-type" />
                                                <Label htmlFor="other-type" className="font-normal cursor-pointer">
                                                    अन्य
                                                </Label>
                                            </div>
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.rate')}</FormLabel>
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

                        {/* Amount (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherPurchase.amount')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.gst')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.gstAmount')}</FormLabel>
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

                        {/* Total With GST (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="totalWithGst"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherPurchase.totalWithGst')}</FormLabel>
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

                        {/* Discount Percent */}
                        <FormField
                            control={form.control}
                            name="discountPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherPurchase.discountPercent')}</FormLabel>
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

                        {/* Discount Amount (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="discountAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherPurchase.discountAmount')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.brokeragePerQuintal')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.brokerPayable')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherPurchase.totalPayable')}</FormLabel>
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
                                disabled={createOtherPurchase.isPending}
                            >
                                {createOtherPurchase.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
