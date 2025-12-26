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
import { useCreateGovtSackOutward } from '@/hooks/useGovtSackOutward';
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
const govtSackOutwardFormSchema = z.object({
    gunnyDmNo: z.string().min(1, {
        message: 'DM number is required.',
    }),
    date: z.date({
        required_error: 'Date is required.',
    }),
    samitiSangrahan: z.string().min(1, {
        message: 'Please select Samiti/Sangrahan.',
    }),
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

export default function AddGovtSackOutwardForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createGovtSackOutward = useCreateGovtSackOutward();

    const samitiSangrahanOptions = [
        { value: 'समिति 1', label: 'समिति 1' },
        { value: 'समिति 2', label: 'समिति 2' },
        { value: 'संग्रहण 1', label: 'संग्रहण 1' },
        { value: 'संग्रहण 2', label: 'संग्रहण 2' },
    ];

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(govtSackOutwardFormSchema),
        defaultValues: {
            gunnyDmNo: '',
            date: new Date(),
            samitiSangrahan: '',
            oldGunnyQty: '',
            plasticGunnyQty: '',
            truckNo: '',
        },
    });

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'dd-MM-yy'),
        };

        createGovtSackOutward.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.govtSackOutward.successMessage') || 'Govt Sack Outward Added Successfully', {
                    description: `Outward DM ${data.gunnyDmNo} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Govt Sack Outward', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'govt-sack-outward',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.govtSackOutward.title')}</CardTitle>
                <CardDescription>
                    {t('forms.govtSackOutward.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Gunny DM Number */}
                        <FormField
                            control={form.control}
                            name="gunnyDmNo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.govtSackOutward.gunnyDmNo')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="DM-001"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Date with Calendar */}
                        <DatePickerField
                            name="date"
                            label={t('forms.common.date')}
                        />

                        {/* Samiti/Sangrahan Dropdown */}
                        <FormField
                            control={form.control}
                            name="samitiSangrahan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.govtSackOutward.samitiSangrahan')}</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={samitiSangrahanOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Select"
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
                                    <FormLabel className="text-base">{t('forms.govtSackOutward.oldGunnyQty')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtSackOutward.plasticGunnyQty')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.govtSackOutward.truckNo')}</FormLabel>
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
                                disabled={createGovtSackOutward.isPending}
                            >
                                {createGovtSackOutward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
