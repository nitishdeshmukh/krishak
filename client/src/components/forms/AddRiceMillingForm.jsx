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
import { useCreateRiceMilling } from '@/hooks/useRiceMilling';

// Form validation schema
const riceMillingFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    riceType: z.string().min(1, {
        message: 'Please select rice type.',
    }),
    hopperGunny: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    hopperQtl: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    riceQty: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    ricePercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    khandaQty: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    khandaPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    silkyKodhaQty: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    silkyKodhaPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    wastagePercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddRiceMillingForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createRiceMilling = useCreateRiceMilling();

    // Sample data - Replace with actual data from API
    const riceTypes = ['चावल (पतला)', 'चावल (मोटा)'];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(riceMillingFormSchema),
        defaultValues: {
            date: new Date(),
            riceType: '',
            hopperGunny: '',
            hopperQtl: '',
            riceQty: '',
            ricePercent: '',
            khandaQty: '',
            khandaPercent: '',
            silkyKodhaQty: '',
            silkyKodhaPercent: '',
            wastagePercent: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['hopperQtl', 'riceQty', 'khandaQty', 'silkyKodhaQty']);

    React.useEffect(() => {
        const [hopperQtl, riceQty, khandaQty, silkyKodhaQty] = watchedFields;
        const hopper = parseFloat(hopperQtl) || 0;
        const rice = parseFloat(riceQty) || 0;
        const khanda = parseFloat(khandaQty) || 0;
        const silkyKodha = parseFloat(silkyKodhaQty) || 0;

        if (hopper > 0) {
            // Calculate percentages based on hopper quantity
            const ricePercent = (rice / hopper) * 100;
            const khandaPercent = (khanda / hopper) * 100;
            const silkyKodhaPercent = (silkyKodha / hopper) * 100;

            // Wastage = 100 - sum of all percentages
            const totalPercent = ricePercent + khandaPercent + silkyKodhaPercent;
            const wastage = 100 - totalPercent;

            form.setValue('ricePercent', ricePercent.toFixed(2));
            form.setValue('khandaPercent', khandaPercent.toFixed(2));
            form.setValue('silkyKodhaPercent', silkyKodhaPercent.toFixed(2));
            form.setValue('wastagePercent', wastage >= 0 ? wastage.toFixed(2) : '0.00');
        }
    }, [watchedFields, form]);

    // Form submission handler
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createRiceMilling.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.riceMilling.successMessage') || 'Rice Milling Added Successfully', {
                    description: `Milling for ${data.riceType} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Rice Milling', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.riceMilling.title')}</CardTitle>
                <CardDescription>
                    {t('forms.riceMilling.description')}
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

                        {/* Rice Type Dropdown */}
                        <FormField
                            control={form.control}
                            name="riceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.riceType')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {riceTypes.map((item) => (
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

                        {/* Hopper Gunny (Sack Count) */}
                        <FormField
                            control={form.control}
                            name="hopperGunny"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.hopperGunny')}</FormLabel>
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

                        {/* Hopper Quantity (Quintal) */}
                        <FormField
                            control={form.control}
                            name="hopperQtl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.hopperQtl')}</FormLabel>
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

                        {/* Rice Quantity */}
                        <FormField
                            control={form.control}
                            name="riceQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.riceQty')}</FormLabel>
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

                        {/* Rice Percent (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="ricePercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.ricePercent')}</FormLabel>
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

                        {/* Khanda (Brokens) Quantity */}
                        <FormField
                            control={form.control}
                            name="khandaQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.khandaQty')}</FormLabel>
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

                        {/* Khanda Percent (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="khandaPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.khandaPercent')}</FormLabel>
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

                        {/* Silky Kodha (White Bran) Quantity */}
                        <FormField
                            control={form.control}
                            name="silkyKodhaQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.silkyKodhaQty')}</FormLabel>
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

                        {/* Silky Kodha Percent (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="silkyKodhaPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.silkyKodhaPercent')}</FormLabel>
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

                        {/* Wastage Percent (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="wastagePercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceMilling.wastagePercent')}</FormLabel>
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
                                disabled={createRiceMilling.isPending}
                            >
                                {createRiceMilling.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
