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
import { useCreateSackInward } from '@/hooks/useSackInward';

// Form validation schema
const sackInwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    sackPurchaseNumber: z.string().min(1, {
        message: 'Please select sack purchase.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    gunnyNew: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyOld: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyPlastic: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyBundle: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddSackInwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createSackInward = useCreateSackInward();

    // Sample data - Replace with actual data from API
    const sackPurchases = ['SP-001', 'SP-002', 'SP-003', 'SP-004'];
    const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(sackInwardFormSchema),
        defaultValues: {
            date: new Date(),
            sackPurchaseNumber: '',
            partyName: '',
            gunnyNew: '',
            gunnyOld: '',
            gunnyPlastic: '',
            gunnyBundle: '',
        },
    });

    // Form submission handler
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createSackInward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.sackInward.successMessage') || 'Sack Inward Added Successfully', {
                    description: `Inward for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Sack Inward', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.sackInward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.sackInward.description')}
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

                        {/* Sack Purchase Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="sackPurchaseNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.sackPurchaseNumber')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sackPurchases.map((sp) => (
                                                <SelectItem key={sp} value={sp}>
                                                    {sp}
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
                                    <FormLabel className="text-base">{t('forms.sackInward.partyName')}</FormLabel>
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

                        {/* Gunny New */}
                        <FormField
                            control={form.control}
                            name="gunnyNew"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.gunnyNew')}</FormLabel>
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

                        {/* Gunny Old */}
                        <FormField
                            control={form.control}
                            name="gunnyOld"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.gunnyOld')}</FormLabel>
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

                        {/* Gunny Plastic */}
                        <FormField
                            control={form.control}
                            name="gunnyPlastic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.gunnyPlastic')}</FormLabel>
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

                        {/* Gunny Bundle */}
                        <FormField
                            control={form.control}
                            name="gunnyBundle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.sackInward.gunnyBundle')}</FormLabel>
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

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createSackInward.isPending}
                            >
                                {createSackInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
