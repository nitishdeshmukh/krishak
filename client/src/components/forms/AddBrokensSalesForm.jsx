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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateBrokensSales } from '@/hooks/useBrokensSales';

// Form validation schema
const brokensSalesFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    brokerName: z.string().min(1, {
        message: 'Please select a broker.',
    }),
    khandaQuantity: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    khandaRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    khandaAmount: z.string().regex(/^\d*\.?\d*$/, {
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

export default function AddBrokensSalesForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createBrokensSales = useCreateBrokensSales();

    // Sample data - Replace with actual data from API
    const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
    const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(brokensSalesFormSchema),
        defaultValues: {
            date: new Date(),
            partyName: '',
            brokerName: '',
            khandaQuantity: '',
            khandaRate: '',
            khandaAmount: '',
            discountPercent: '',
            discountAmount: '',
            brokeragePerQuintal: '',
            brokerPayable: '',
            totalPayable: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['khandaQuantity', 'khandaRate', 'discountPercent', 'brokeragePerQuintal']);

    React.useEffect(() => {
        const [khandaQuantity, khandaRate, discountPercent, brokeragePerQuintal] = watchedFields;
        const qty = parseFloat(khandaQuantity) || 0;
        const rate = parseFloat(khandaRate) || 0;
        const discount = parseFloat(discountPercent) || 0;
        const brokerage = parseFloat(brokeragePerQuintal) || 0;

        // Calculate khanda amount
        const khandaAmount = qty * rate;

        // Calculate discount amount
        const discountAmount = (khandaAmount * discount) / 100;

        // Calculate broker payable
        const brokerPayable = qty * brokerage;

        // Calculate total payable
        const totalPayable = khandaAmount - discountAmount;

        if (khandaAmount > 0) {
            form.setValue('khandaAmount', khandaAmount.toFixed(2));
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

        createBrokensSales.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.brokensSales.successMessage') || 'Brokens Sales Added Successfully', {
                    description: `Sale for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Brokens Sales', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.brokensSales.title')}</CardTitle>
                <CardDescription>
                    {t('forms.brokensSales.description')}
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
                                    <FormLabel className="text-base">{t('forms.brokensSales.partyName')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.brokensSales.brokerName')}</FormLabel>
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

                        {/* Khanda Quantity (in Quintal) */}
                        <FormField
                            control={form.control}
                            name="khandaQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.brokensSales.khandaQuantity')}</FormLabel>
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

                        {/* Khanda Rate */}
                        <FormField
                            control={form.control}
                            name="khandaRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.brokensSales.khandaRate')}</FormLabel>
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

                        {/* Khanda Amount (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="khandaAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.brokensSales.khandaAmount')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.brokensSales.discountPercent')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.brokensSales.discountAmount')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.brokensSales.brokeragePerQuintal')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.brokensSales.brokerPayable')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.brokensSales.totalPayable')}</FormLabel>
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
                                disabled={createBrokensSales.isPending}
                            >
                                {createBrokensSales.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
