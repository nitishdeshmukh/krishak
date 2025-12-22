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
import { useCreateOtherInward } from '@/hooks/useOtherInward';

// Form validation schema
const otherInwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    otherPurchaseNumber: z.string().min(1, {
        message: 'Please select other purchase.',
    }),
    itemName: z.string().min(1, {
        message: 'Item name is required.',
    }),
    quantity: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    quantityType: z.enum(['kg', 'quintal', 'ton', 'piece'], {
        required_error: 'Please select quantity type.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    brokerName: z.string().min(1, {
        message: 'Please select a broker.',
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
    juteWeight: z.string().regex(/^\d*\.?\d*$/, {
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

export default function AddOtherInwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createOtherInward = useCreateOtherInward();

    // Sample data - Replace with actual data from API
    const otherPurchases = ['OP-001', 'OP-002', 'OP-003'];
    const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
    const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];
    const quantityTypes = [
        { value: 'kg', label: t('forms.otherInward.quantityTypes.kg') || 'कि.ग्रा.' },
        { value: 'quintal', label: t('forms.otherInward.quantityTypes.quintal') || 'क्विंटल' },
        { value: 'ton', label: t('forms.otherInward.quantityTypes.ton') || 'टन' },
        { value: 'piece', label: t('forms.otherInward.quantityTypes.piece') || 'नग' },
    ];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(otherInwardFormSchema),
        defaultValues: {
            date: new Date(),
            otherPurchaseNumber: '',
            itemName: '',
            quantity: '',
            quantityType: 'quintal',
            partyName: '',
            brokerName: '',
            gunnyNew: '',
            gunnyOld: '',
            gunnyPlastic: '',
            juteWeight: '',
            plasticWeight: '',
            truckNo: '',
            rstNo: '',
            truckWeight: '',
            gunnyWeight: '',
            finalWeight: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['truckWeight', 'juteWeight', 'plasticWeight']);

    React.useEffect(() => {
        const [truckWeight, juteWeight, plasticWeight] = watchedFields;
        const truck = parseFloat(truckWeight) || 0;
        const jute = parseFloat(juteWeight) || 0;
        const plastic = parseFloat(plasticWeight) || 0;

        // Gunny weight = jute + plastic
        const gunnyWeight = jute + plastic;
        form.setValue('gunnyWeight', gunnyWeight.toFixed(2));

        // Final weight = truck weight - gunny weight
        const finalWeight = truck - gunnyWeight;
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

        createOtherInward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.otherInward.successMessage') || 'Other Inward Added Successfully', {
                    description: `Inward for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Other Inward', {
                    description: error.message,
                });
            },
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.otherInward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.otherInward.description')}
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

                        {/* Other Purchase Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="otherPurchaseNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherInward.otherPurchaseNumber')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {otherPurchases.map((op) => (
                                                <SelectItem key={op} value={op}>
                                                    {op}
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
                                    <FormLabel className="text-base">{t('forms.otherInward.itemName')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="वस्तु का नाम"
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
                                    <FormLabel className="text-base">{t('forms.otherInward.quantity')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.quantityType')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-wrap gap-4"
                                        >
                                            {quantityTypes.map((type) => (
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

                        {/* Party Name Dropdown */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherInward.partyName')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.brokerName')}</FormLabel>
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

                        {/* Gunny New */}
                        <FormField
                            control={form.control}
                            name="gunnyNew"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherInward.gunnyNew')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.gunnyOld')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.gunnyPlastic')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.juteWeight')}</FormLabel>
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

                        {/* Plastic Weight */}
                        <FormField
                            control={form.control}
                            name="plasticWeight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.otherInward.plasticWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.truckNo')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.rstNo')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.truckWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.gunnyWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.otherInward.finalWeight')}</FormLabel>
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
                                disabled={createOtherInward.isPending}
                            >
                                {createOtherInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
