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
import { useCreateSackSales } from '@/hooks/useSackSales';

// Form validation schema
const sackSalesFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    newPackagingCount: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    newPackagingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    oldPackagingCount: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    oldPackagingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    plasticPackagingCount: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    plasticPackagingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    payableAmount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddSackSalesForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createSackSales = useCreateSackSales();

    // Sample data - Replace with actual data from API
    const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(sackSalesFormSchema),
        defaultValues: {
            date: new Date(),
            partyName: '',
            newPackagingCount: '',
            newPackagingRate: '',
            oldPackagingCount: '',
            oldPackagingRate: '',
            plasticPackagingCount: '',
            plasticPackagingRate: '',
            payableAmount: '',
        },
    });

    // Calculate payable amount automatically
    const watchedFields = form.watch(['newPackagingCount', 'newPackagingRate', 'oldPackagingCount', 'oldPackagingRate', 'plasticPackagingCount', 'plasticPackagingRate']);

    React.useEffect(() => {
        const [newCount, newRate, oldCount, oldRate, plasticCount, plasticRate] = watchedFields;
        const newTotal = (parseFloat(newCount) || 0) * (parseFloat(newRate) || 0);
        const oldTotal = (parseFloat(oldCount) || 0) * (parseFloat(oldRate) || 0);
        const plasticTotal = (parseFloat(plasticCount) || 0) * (parseFloat(plasticRate) || 0);
        const total = newTotal + oldTotal + plasticTotal;
        if (total > 0) {
            form.setValue('payableAmount', total.toFixed(2));
        }
    }, [watchedFields, form]);

    // Form submission handler
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createSackSales.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.sackSales.successMessage') || 'Sack Sales Added Successfully', {
                    description: `Sale for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Sack Sales', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.sackSales.title')}</CardTitle>
                <CardDescription>
                    {t('forms.sackSales.description')}
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
                                    <FormLabel className="text-base">{t('forms.sackSales.partyName')}</FormLabel>
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

                        {/* New Packaging Count */}
                        <FormField
                            control={form.control}
                            name="newPackagingCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackSales.newPackagingCount')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* New Packaging Rate */}
                        <FormField
                            control={form.control}
                            name="newPackagingRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackSales.newPackagingRate')}</FormLabel>
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

                        {/* Old Packaging Count */}
                        <FormField
                            control={form.control}
                            name="oldPackagingCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackSales.oldPackagingCount')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Old Packaging Rate */}
                        <FormField
                            control={form.control}
                            name="oldPackagingRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackSales.oldPackagingRate')}</FormLabel>
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

                        {/* Plastic Packaging Count */}
                        <FormField
                            control={form.control}
                            name="plasticPackagingCount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackSales.plasticPackagingCount')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Plastic Packaging Rate */}
                        <FormField
                            control={form.control}
                            name="plasticPackagingRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackSales.plasticPackagingRate')}</FormLabel>
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

                        {/* Payable Amount (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="payableAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackSales.payableAmount')}</FormLabel>
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
                                disabled={createSackSales.isPending}
                            >
                                {createSackSales.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
