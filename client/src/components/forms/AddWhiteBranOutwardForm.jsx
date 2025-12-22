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
import { useCreateWhiteBranOutward } from '@/hooks/useWhiteBranOutward';

// Form validation schema
const whiteBranOutwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    silkyKodhaSaleNumber: z.string().min(1, {
        message: 'Please select silky kodha sale.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    brokerName: z.string().min(1, {
        message: 'Please select a broker.',
    }),
    gunnyPlastic: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    plasticWeight: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    truckNo: z.string().min(1, {
        message: 'Truck number is required.',
    }),
    rstNo: z.string().optional(),
    truckWeight: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyWeight: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    finalWeight: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddWhiteBranOutwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createWhiteBranOutward = useCreateWhiteBranOutward();

    // Sample data - Replace with actual data from API
    const silkyKodhaSales = ['SKD-001', 'SKD-002', 'SKD-003'];
    const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
    const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(whiteBranOutwardFormSchema),
        defaultValues: {
            date: new Date(),
            silkyKodhaSaleNumber: '',
            partyName: '',
            brokerName: '',
            gunnyPlastic: '',
            plasticWeight: '',
            truckNo: '',
            rstNo: '',
            truckWeight: '',
            gunnyWeight: '',
            finalWeight: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['truckWeight', 'plasticWeight']);

    React.useEffect(() => {
        const [truckWeight, plasticWeight] = watchedFields;
        const truck = parseFloat(truckWeight) || 0;
        const plastic = parseFloat(plasticWeight) || 0;

        // Gunny weight = plastic weight
        form.setValue('gunnyWeight', plastic.toFixed(2));

        // Final weight = truck weight - gunny weight
        const finalWeight = truck - plastic;
        if (finalWeight >= 0) {
            form.setValue('finalWeight', finalWeight.toFixed(2));
        }
    }, [watchedFields, form]);

    // Form submission handler
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createWhiteBranOutward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.whiteBranOutward.successMessage') || 'White Bran Outward Added Successfully', {
                    description: `Outward for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating White Bran Outward', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.whiteBranOutward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.whiteBranOutward.description')}
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

                        {/* Silky Kodha Sale Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="silkyKodhaSaleNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.silkyKodhaSaleNumber')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {silkyKodhaSales.map((item) => (
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
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.partyName')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.brokerName')}</FormLabel>
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

                        {/* Gunny Plastic */}
                        <FormField
                            control={form.control}
                            name="gunnyPlastic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.gunnyPlastic')}</FormLabel>
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

                        {/* Plastic Weight */}
                        <FormField
                            control={form.control}
                            name="plasticWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.plasticWeight')}</FormLabel>
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

                        {/* Truck Number */}
                        <FormField
                            control={form.control}
                            name="truckNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.truckNo')}</FormLabel>
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

                        {/* RST Number */}
                        <FormField
                            control={form.control}
                            name="rstNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.rstNo')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="RST-001"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Truck Weight */}
                        <FormField
                            control={form.control}
                            name="truckWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.truckWeight')}</FormLabel>
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

                        {/* Gunny Weight (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="gunnyWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.gunnyWeight')}</FormLabel>
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

                        {/* Final Weight (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="finalWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.whiteBranOutward.finalWeight')}</FormLabel>
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
                                disabled={createWhiteBranOutward.isPending}
                            >
                                {createWhiteBranOutward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
