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
import { useCreatePaddyMilling } from '@/hooks/usePaddyMilling';
import { paddyTypeOptions, riceTypeOptions } from '@/lib/constants';
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
const paddyMillingFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    paddyType: z.string().min(1, {
        message: 'Please select paddy type.',
    }),
    hopperGunny: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    hopperQtl: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    riceType: z.string().min(1, {
        message: 'Please select rice type.',
    }),
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
    kodhaQty: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    kodhaPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    bhusaTon: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    bhusaPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    nakkhiQty: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    nakkhiPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    wastagePercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddPaddyMillingForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createPaddyMilling = useCreatePaddyMilling();

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(paddyMillingFormSchema),
        defaultValues: {
            date: new Date(),
            paddyType: '',
            hopperGunny: '',
            hopperQtl: '',
            riceType: '',
            riceQty: '',
            ricePercent: '',
            khandaQty: '',
            khandaPercent: '',
            kodhaQty: '',
            kodhaPercent: '',
            bhusaTon: '',
            bhusaPercent: '',
            nakkhiQty: '',
            nakkhiPercent: '',
            wastagePercent: '',
        },
    });

    // Watch fields for auto-calculation
    const watchedFields = form.watch(['hopperQtl', 'riceQty', 'khandaQty', 'kodhaQty', 'bhusaTon', 'nakkhiQty']);

    React.useEffect(() => {
        const [hopperQtl, riceQty, khandaQty, kodhaQty, bhusaTon, nakkhiQty] = watchedFields;
        const hopper = parseFloat(hopperQtl) || 0;
        const rice = parseFloat(riceQty) || 0;
        const khanda = parseFloat(khandaQty) || 0;
        const kodha = parseFloat(kodhaQty) || 0;
        const bhusa = parseFloat(bhusaTon) || 0;
        const nakkhi = parseFloat(nakkhiQty) || 0;

        if (hopper > 0) {
            // Calculate percentages based on hopper quantity
            const ricePercent = (rice / hopper) * 100;
            const khandaPercent = (khanda / hopper) * 100;
            const kodhaPercent = (kodha / hopper) * 100;
            // bhusa is in tons, convert to quintal (1 ton = 10 quintal)
            const bhusaPercent = ((bhusa * 10) / hopper) * 100;
            const nakkhiPercent = (nakkhi / hopper) * 100;

            // Wastage = 100 - sum of all percentages
            const totalPercent = ricePercent + khandaPercent + kodhaPercent + bhusaPercent + nakkhiPercent;
            const wastage = 100 - totalPercent;

            form.setValue('ricePercent', ricePercent.toFixed(2));
            form.setValue('khandaPercent', khandaPercent.toFixed(2));
            form.setValue('kodhaPercent', kodhaPercent.toFixed(2));
            form.setValue('bhusaPercent', bhusaPercent.toFixed(2));
            form.setValue('nakkhiPercent', nakkhiPercent.toFixed(2));
            form.setValue('wastagePercent', wastage >= 0 ? wastage.toFixed(2) : '0.00');
        }
    }, [watchedFields, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createPaddyMilling.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.paddyMilling.successMessage') || 'Paddy Milling Added Successfully', {
                    description: `Milling for ${data.paddyType} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Paddy Milling', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'paddy-milling',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.paddyMilling.title')}</CardTitle>
                <CardDescription>
                    {t('forms.paddyMilling.description')}
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

                        {/* Paddy Type Dropdown */}
                        <FormField
                            control={form.control}
                            name="paddyType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.paddyType')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={paddyTypeOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
                                        />
                                    </FormControl>
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
                                    <FormLabel className="text-base">{t('forms.paddyMilling.hopperGunny')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.paddyMilling.hopperQtl')}</FormLabel>
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

                        {/* Rice Type Dropdown */}
                        <FormField
                            control={form.control}
                            name="riceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.riceType')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={riceTypeOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
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
                                    <FormLabel className="text-base">{t('forms.paddyMilling.riceQty')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.paddyMilling.ricePercent')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.paddyMilling.khandaQty')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.paddyMilling.khandaPercent')}</FormLabel>
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

                        {/* Kodha (Rice Bran) Quantity */}
                        <FormField
                            control={form.control}
                            name="kodhaQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.kodhaQty')}</FormLabel>
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

                        {/* Kodha Percent (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="kodhaPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.kodhaPercent')}</FormLabel>
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

                        {/* Bhusa (Husk) in Tons */}
                        <FormField
                            control={form.control}
                            name="bhusaTon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.bhusaTon')}</FormLabel>
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

                        {/* Bhusa Percent (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="bhusaPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.bhusaPercent')}</FormLabel>
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

                        {/* Nakkhi (Brewers) Quantity */}
                        <FormField
                            control={form.control}
                            name="nakkhiQty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.nakkhiQty')}</FormLabel>
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

                        {/* Nakkhi Percent (Auto-calculated) */}
                        <FormField
                            control={form.control}
                            name="nakkhiPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.paddyMilling.nakkhiPercent')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.paddyMilling.wastagePercent')}</FormLabel>
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
                                disabled={createPaddyMilling.isPending}
                            >
                                {createPaddyMilling.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
