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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCreateGovtRiceOutward } from '@/hooks/useGovtRiceOutward';

// Form validation schema
const govtRiceOutwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    lotNo: z.string().min(1, {
        message: 'Please select LOT number.',
    }),
    fciNan: z.enum(['fci', 'nan'], {
        required_error: 'Please select FCI/NAN.',
    }),
    riceType: z.enum(['mota', 'patla'], {
        required_error: 'Please select rice type.',
    }),
    gunnyNew: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    gunnyOld: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    juteWeight: z.string().regex(/^\d*\.?\d*$/, {
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

export default function AddGovtRiceOutwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createGovtRiceOutward = useCreateGovtRiceOutward();

    // Sample data - Replace with actual data from API
    const lotNumbers = ['LOT-001', 'LOT-002', 'LOT-003'];
    const fciNanOptions = [
        { value: 'fci', label: 'FCI' },
        { value: 'nan', label: 'NAN' },
    ];
    const riceTypes = [
        { value: 'mota', label: t('forms.govtRiceOutward.riceTypes.mota') || 'चावल(मोटा)' },
        { value: 'patla', label: t('forms.govtRiceOutward.riceTypes.patla') || 'चावल(पतला)' },
    ];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(govtRiceOutwardFormSchema),
        defaultValues: {
            date: new Date(),
            lotNo: '',
            fciNan: 'fci',
            riceType: 'mota',
            gunnyNew: '',
            gunnyOld: '',
            juteWeight: '',
            truckNo: '',
            rstNo: '',
            truckWeight: '',
            gunnyWeight: '',
            finalWeight: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['truckWeight', 'juteWeight']);

    React.useEffect(() => {
        const [truckWeight, juteWeight] = watchedFields;
        const truck = parseFloat(truckWeight) || 0;
        const jute = parseFloat(juteWeight) || 0;

        // Gunny weight = jute weight
        form.setValue('gunnyWeight', jute.toFixed(2));

        // Final weight = truck weight - gunny weight
        const finalWeight = truck - jute;
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

        createGovtRiceOutward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.govtRiceOutward.successMessage') || 'Govt Rice Outward Added Successfully', {
                    description: `Outward for LOT ${data.lotNo} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Govt Rice Outward', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.govtRiceOutward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.govtRiceOutward.description')}
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

                        {/* LOT Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="lotNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.lotNo')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {lotNumbers.map((lot) => (
                                                <SelectItem key={lot} value={lot}>
                                                    {lot}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* FCI/NAN Radio */}
                        <FormField
                            control={form.control}
                            name="fciNan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.fciNan')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-wrap gap-4"
                                        >
                                            {fciNanOptions.map((option) => (
                                                <div key={option.value} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option.value} id={`fci-${option.value}`} />
                                                    <Label htmlFor={`fci-${option.value}`}>{option.label}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Rice Type Dropdown */}
                        <FormField
                            control={form.control}
                            name="riceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.riceType')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {riceTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
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
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.gunnyNew')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.gunnyOld')}</FormLabel>
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

                        {/* Jute Weight */}
                        <FormField
                            control={form.control}
                            name="juteWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.juteWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.truckNo')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.rstNo')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.truckWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.gunnyWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtRiceOutward.finalWeight')}</FormLabel>
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
                                disabled={createGovtRiceOutward.isPending}
                            >
                                {createGovtRiceOutward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
