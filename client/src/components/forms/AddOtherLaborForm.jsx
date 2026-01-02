import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateOtherLabor } from '@/hooks/useOtherLabor';
import { useLaborTeams } from '@/hooks/useLaborTeam';
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
const otherLaborFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    laborType: z.enum(['pala_bharai', 'kota', 'silai', 'other'], {
        required_error: 'Please select labor type.',
    }),
    laborTeam: z.string().min(1, {
        message: 'Labor team is required.',
    }),
    gunnyCount: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    rate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    detail: z.string().optional(),
    totalAmount: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
});

export default function AddOtherLaborForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createOtherLabor = useCreateOtherLabor();
    const [selectedLaborType, setSelectedLaborType] = useState('');

    // Fetch labor teams from server
    const { data: laborTeams, isLoading: isLoadingTeams } = useLaborTeams();

    // Convert labor teams to options format
    const laborTeamOptions = useMemo(() =>
        (laborTeams).map(team => ({
            value: team.name,
            label: team.name
        })),
        [laborTeams]
    );

    // Initialize form
    const form = useForm({
        resolver: zodResolver(otherLaborFormSchema),
        defaultValues: {
            date: new Date(),
            laborType: '',
            laborTeam: '',
            gunnyCount: '',
            rate: '',
            detail: '',
            totalAmount: '',
        },
    });

    // Watch fields for auto-calculation
    const [gunnyCount, rate] = form.watch(['gunnyCount', 'rate']);

    // Auto-calculate total amount for pala_bharai, kota, silai
    useEffect(() => {
        if (['pala_bharai', 'kota', 'silai'].includes(selectedLaborType)) {
            const count = parseFloat(gunnyCount) || 0;
            const rateVal = parseFloat(rate) || 0;
            const total = count * rateVal;
            form.setValue('totalAmount', total > 0 ? total.toFixed(2) : '');
        }
    }, [gunnyCount, rate, selectedLaborType, form]);

    // Handle labor type change
    const handleLaborTypeChange = useCallback((type) => {
        setSelectedLaborType(type);
        form.setValue('laborType', type);

        // Reset conditional fields
        form.setValue('gunnyCount', '');
        form.setValue('rate', '');
        form.setValue('detail', '');
        form.setValue('totalAmount', '');
    }, [form]);

    // Form submission handler
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
            gunnyCount: data.gunnyCount ? parseInt(data.gunnyCount) : 0,
            rate: data.rate ? parseFloat(data.rate) : 0,
            totalAmount: parseFloat(data.totalAmount),
        };

        createOtherLabor.mutate(formattedData, {
            onSuccess: () => {
                toast.success('Other Labor Added Successfully', {
                    description: `Labor record for ${data.laborTeam} has been created.`,
                });
                form.reset();
                setSelectedLaborType('');
            },
            onError: (error) => {
                toast.error('Error creating Other Labor', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'other-labor',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog
    const onSubmit = async (data) => {
        openDialog(data);
    };

    // Check if labor type requires gunny count and rate
    const isCountableType = ['pala_bharai', 'kota', 'silai'].includes(selectedLaborType);
    const isOtherType = selectedLaborType === 'other';

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>अन्य हमाली</CardTitle>
                <CardDescription>
                    Add other labor cost details
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Date */}
                        <DatePickerField
                            name="date"
                            label={t('forms.common.date')}
                        />

                        {/* Labor Type Radio */}
                        <FormField
                            control={form.control}
                            name="laborType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base">हमाली प्रकार</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={handleLaborTypeChange}
                                            value={selectedLaborType}
                                            className="flex flex-wrap gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="pala_bharai" />
                                                </FormControl>
                                                <FormLabel className="font-normal">पाला भराई</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="kota" />
                                                </FormControl>
                                                <FormLabel className="font-normal">कांटा</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="silai" />
                                                </FormControl>
                                                <FormLabel className="font-normal">सिलाई</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="other" />
                                                </FormControl>
                                                <FormLabel className="font-normal">अन्य</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Labor Team (SearchableSelect - Always Visible) */}
                        <FormField
                            control={form.control}
                            name="laborTeam"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">हमाल/रेजा टोली</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={laborTeamOptions}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={isLoadingTeams ? "Loading..." : "Select labor team"}
                                            disabled={isLoadingTeams}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Conditional Fields for Pala Bharai/Kota/Silai */}
                        {isCountableType && (
                            <>
                                {/* Gunny Count (बारदाना संख्या) */}
                                <FormField
                                    control={form.control}
                                    name="gunnyCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">बारदाना संख्या</FormLabel>
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

                                {/* Rate (हमाली दर) */}
                                <FormField
                                    control={form.control}
                                    name="rate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">हमाली दर</FormLabel>
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

                                {/* Total Amount (Calculated) */}
                                <div className="space-y-2 bg-muted p-4 rounded-lg">
                                    <FormLabel className="text-base font-semibold">कुल राशि</FormLabel>
                                    <Input
                                        type="text"
                                        value={`₹ ${form.watch('totalAmount') || '0.00'}`}
                                        readOnly
                                        className="bg-background font-semibold text-lg"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        = बारदाना संख्या × हमाली दर
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Conditional Fields for Other */}
                        {isOtherType && (
                            <>
                                {/* Detail/Description (काम का विवरण) */}
                                <FormField
                                    control={form.control}
                                    name="detail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">काम का विवरण</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="काम का विवरण लिखें..."
                                                    {...field}
                                                    className="placeholder:text-gray-400"
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Total Amount (Manual Entry) */}
                                <FormField
                                    control={form.control}
                                    name="totalAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">कुल राशि</FormLabel>
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
                            </>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createOtherLabor.isPending || !selectedLaborType}
                            >
                                {createOtherLabor.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
