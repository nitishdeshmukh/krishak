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
import { useCreatePrivateSackOutward } from '@/hooks/usePrivateSackOutward';

// Form validation schema
const privateSackOutwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    sackSaleNumber: z.string().min(1, {
        message: 'Please select sack sale.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    newGunnyQty: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    oldGunnyQty: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    plasticGunnyQty: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    truckNo: z.string().min(1, {
        message: 'Truck number is required.',
    }),
});

export default function AddPrivateSackOutwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createPrivateSackOutward = useCreatePrivateSackOutward();

    // Sample data - Replace with actual data from API
    const sackSales = ['SS-001', 'SS-002', 'SS-003'];
    const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(privateSackOutwardFormSchema),
        defaultValues: {
            date: new Date(),
            sackSaleNumber: '',
            partyName: '',
            newGunnyQty: '',
            oldGunnyQty: '',
            plasticGunnyQty: '',
            truckNo: '',
        },
    });

    // Form submission handler
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createPrivateSackOutward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.privateSackOutward.successMessage') || 'Private Sack Outward Added Successfully', {
                    description: `Outward for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Private Sack Outward', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.privateSackOutward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.privateSackOutward.description')}
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

                        {/* Sack Sale Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="sackSaleNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.sackSaleNumber')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sackSales.map((item) => (
                                                <SelectItem key={item} value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Party Name Dropdown */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.partyName')}</FormLabel>
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

                        {/* New Gunny Quantity */}
                        <FormField
                            control={form.control}
                            name="newGunnyQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.newGunnyQty')}</FormLabel>
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

                        {/* Old Gunny Quantity */}
                        <FormField
                            control={form.control}
                            name="oldGunnyQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.oldGunnyQty')}</FormLabel>
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

                        {/* Plastic Gunny Quantity */}
                        <FormField
                            control={form.control}
                            name="plasticGunnyQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.plasticGunnyQty')}</FormLabel>
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

                        {/* Truck Number */}
                        <FormField
                            control={form.control}
                            name="truckNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.privateSackOutward.truckNo')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="MH12AB1234"
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
                                disabled={createPrivateSackOutward.isPending}
                            >
                                {createPrivateSackOutward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
