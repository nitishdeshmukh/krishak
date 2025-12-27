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
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateRiceBranOutward } from '@/hooks/useRiceBranOutward';
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
const riceBranOutwardFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    kodhaSaleNumber: z.string().min(1, {
        message: 'Please select kodha sale.',
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

export default function AddRiceBranOutwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createRiceBranOutward = useCreateRiceBranOutward();

    const kodhaSaleOptions = [
        { value: 'KD-001', label: 'KD-001' },
        { value: 'KD-002', label: 'KD-002' },
        { value: 'KD-003', label: 'KD-003' },
    ];
    const partyOptions = [
        { value: 'पार्टी 1', label: 'पार्टी 1' },
        { value: 'पार्टी 2', label: 'पार्टी 2' },
        { value: 'पार्टी 3', label: 'पार्टी 3' },
    ];
    const brokerOptions = [
        { value: 'ब्रोकर 1', label: 'ब्रोकर 1' },
        { value: 'ब्रोकर 2', label: 'ब्रोकर 2' },
        { value: 'ब्रोकर 3', label: 'ब्रोकर 3' },
    ];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(riceBranOutwardFormSchema),
        defaultValues: {
            date: new Date(),
            kodhaSaleNumber: '',
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

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createRiceBranOutward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.riceBranOutward.successMessage') || 'Rice Bran Outward Added Successfully', {
                    description: `Outward for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Rice Bran Outward', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'rice-bran-outward',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.riceBranOutward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.riceBranOutward.description')}
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

                        {/* Kodha Sale Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="kodhaSaleNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.kodhaSaleNumber')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={kodhaSaleOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
                                        />
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.partyName')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.brokerName')}</FormLabel>
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

                        {/* Gunny Plastic */}
                        <FormField
                            control={form.control}
                            name="gunnyPlastic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.gunnyPlastic')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.plasticWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.truckNo')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.rstNo')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.truckWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.gunnyWeight')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceBranOutward.finalWeight')}</FormLabel>
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
                                disabled={createRiceBranOutward.isPending}
                            >
                                {createRiceBranOutward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
