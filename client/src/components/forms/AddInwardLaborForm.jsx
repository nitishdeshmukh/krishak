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
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateInwardLabor } from '@/hooks/useInwardLabor';
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

// Import APIs to fetch inward records by truck number
import { fetchAllPaddyInward } from '@/api/paddyInwardApi';
import { fetchAllRiceInward } from '@/api/riceInwardApi';
import { fetchAllSackInward } from '@/api/sackInwardApi';
import { fetchAllFrkInward } from '@/api/frkInwardApi';
import { fetchAllOtherInward } from '@/api/otherInwardApi';

// Form validation schema
const inwardLaborFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    inwardType: z.enum(['paddy', 'rice', 'sack', 'frk', 'other'], {
        required_error: 'Please select inward type.',
    }),
    truckNumber: z.string().min(1, {
        message: 'Please select truck number.',
    }),
    totalBags: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
    bundleCount: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    unloadingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
    stackingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
    laborTeam: z.string().min(1, {
        message: 'Labor team name is required.',
    }),
});

export default function AddInwardLaborForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createInwardLabor = useCreateInwardLabor();
    const [selectedInwardType, setSelectedInwardType] = useState('');
    const [truckOptions, setTruckOptions] = useState([]);
    const [selectedInward, setSelectedInward] = useState(null);

    // Initialize form
    const form = useForm({
        resolver: zodResolver(inwardLaborFormSchema),
        defaultValues: {
            date: new Date(),
            inwardType: '',
            truckNumber: '',
            totalBags: '',
            bundleCount: '',
            unloadingRate: '',
            stackingRate: '',
            laborTeam: '',
        },
    });

    // Watch fields for auto-calculation
    const [totalBags, unloadingRate, stackingRate] = form.watch(['totalBags', 'unloadingRate', 'stackingRate']);
    const [unloadingAmount, setUnloadingAmount] = useState('0.00');
    const [stackingAmount, setStackingAmount] = useState('0.00');
    const [totalAmount, setTotalAmount] = useState('0.00');

    // Calculate amounts
    useEffect(() => {
        const bags = parseFloat(totalBags) || 0;
        const unloading = parseFloat(unloadingRate) || 0;
        const stacking = parseFloat(stackingRate) || 0;

        const unloadAmt = bags * unloading;
        const stackAmt = bags * stacking;
        const total = unloadAmt + stackAmt;

        setUnloadingAmount(unloadAmt.toFixed(2));
        setStackingAmount(stackAmt.toFixed(2));
        setTotalAmount(total.toFixed(2));
    }, [totalBags, unloadingRate, stackingRate]);

    // Fetch truck numbers when inward type changes
    const handleInwardTypeChange = useCallback(async (type) => {
        setSelectedInwardType(type);
        form.setValue('inwardType', type);
        form.setValue('truckNumber', '');
        form.setValue('totalBags', '');
        form.setValue('bundleCount', '');
        setSelectedInward(null);

        try {
            let response;
            switch (type) {
                case 'paddy':
                    response = await fetchAllPaddyInward();
                    break;
                case 'rice':
                    response = await fetchAllRiceInward();
                    break;
                case 'sack':
                    response = await fetchAllSackInward();
                    break;
                case 'frk':
                    response = await fetchAllFrkInward();
                    break;
                case 'other':
                    response = await fetchAllOtherInward();
                    break;
                default:
                    setTruckOptions([]);
                    return;
            }

            const inwardRecords = response?.data?.paddyInward || response?.data?.riceInward ||
                response?.data?.sackInward || response?.data?.frkInward ||
                response?.data?.otherInward || [];

            const uniqueTrucks = [...new Set(inwardRecords.map(r => r.truckNo).filter(Boolean))];
            setTruckOptions(uniqueTrucks.map(truck => ({ value: truck, label: truck })));
        } catch (error) {
            console.error('Error fetching inward records:', error);
            toast.error('Failed to fetch truck numbers');
            setTruckOptions([]);
        }
    }, [form]);

    // Handle truck number selection - find the inward record and auto-fill bags
    const handleTruckNumberChange = useCallback(async (truckNumber) => {
        form.setValue('truckNumber', truckNumber);

        if (!truckNumber || !selectedInwardType) {
            form.setValue('totalBags', '');
            form.setValue('bundleCount', '');
            setSelectedInward(null);
            return;
        }

        try {
            let response;
            switch (selectedInwardType) {
                case 'paddy':
                    response = await fetchAllPaddyInward();
                    break;
                case 'rice':
                    response = await fetchAllRiceInward();
                    break;
                case 'sack':
                    response = await fetchAllSackInward();
                    break;
                case 'frk':
                    response = await fetchAllFrkInward();
                    break;
                case 'other':
                    response = await fetchAllOtherInward();
                    break;
                default:
                    return;
            }

            const inwardRecords = response?.data?.paddyInward || response?.data?.riceInward ||
                response?.data?.sackInward || response?.data?.frkInward ||
                response?.data?.otherInward || [];

            const record = inwardRecords.find(r => r.truckNo === truckNumber);
            if (record) {
                setSelectedInward(record);
                // Auto-fill total bags
                const bags = record.totalBags || record.bags || record.gunnyNew || record.boriQuantity || 0;
                form.setValue('totalBags', bags.toString());

                // For sack inward, set bundle count if available
                if (selectedInwardType === 'sack' && record.bundleCount) {
                    form.setValue('bundleCount', record.bundleCount.toString());
                }
            }
        } catch (error) {
            console.error('Error fetching inward details:', error);
        }
    }, [form, selectedInwardType]);

    // Form submission handler
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
            totalBags: parseFloat(data.totalBags),
            bundleCount: data.bundleCount ? parseFloat(data.bundleCount) : 0,
            unloadingRate: parseFloat(data.unloadingRate),
            stackingRate: parseFloat(data.stackingRate),
            unloadingAmount: parseFloat(unloadingAmount),
            stackingAmount: parseFloat(stackingAmount),
            totalAmount: parseFloat(totalAmount),
        };

        createInwardLabor.mutate(formattedData, {
            onSuccess: () => {
                toast.success('Inward Labor Added Successfully', {
                    description: `Labor record for ${data.laborTeam} has been created.`,
                });
                form.reset();
                setSelectedInwardType('');
                setTruckOptions([]);
                setSelectedInward(null);
            },
            onError: (error) => {
                toast.error('Error creating Inward Labor', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'inward-labor',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>आवक हमाली</CardTitle>
                <CardDescription>
                    Add inward labor cost details
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

                        {/* Inward Type Radio */}
                        <FormField
                            control={form.control}
                            name="inwardType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base">Inward Type (आवक प्रकार)</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={handleInwardTypeChange}
                                            value={selectedInwardType}
                                            className="flex flex-wrap gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="paddy" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Paddy (धान आवक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="rice" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Rice (चावल आवक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="sack" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Sack (बारदाना आवक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="frk" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    FRK (FRK आवक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="other" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Other (अन्य आवक)
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Truck Number Dropdown */}
                        <FormField
                            control={form.control}
                            name="truckNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Truck Number (ट्रक नं.)</FormLabel>
                                    <FormControl>
                                        <SearchableSelect
                                            options={truckOptions}
                                            value={field.value}
                                            onChange={handleTruckNumberChange}
                                            placeholder="Select Truck"
                                            disabled={!selectedInwardType}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Total Bags (Auto-filled) */}
                        <FormField
                            control={form.control}
                            name="totalBags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Total Bags (बारदाने की संख्या)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0"
                                            {...field}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Bundle Count (Only for Sack) */}
                        {selectedInwardType === 'sack' && (
                            <FormField
                                control={form.control}
                                name="bundleCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Bundle Count (बंडल की संख्या)</FormLabel>
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
                        )}

                        {/* Unloading Rate */}
                        <FormField
                            control={form.control}
                            name="unloadingRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Unloading Rate (उतराई दर)</FormLabel>
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

                        {/* Stacking Rate */}
                        <FormField
                            control={form.control}
                            name="stackingRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Stacking Rate (ढुलाई दर)</FormLabel>
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

                        {/* Labor Team */}
                        <FormField
                            control={form.control}
                            name="laborTeam"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Labor Team (हमाल/रेजा टोली)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter labor team name"
                                            {...field}
                                            className="placeholder:text-gray-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Calculated Amounts (Read-only) */}
                        <div className="space-y-4 bg-muted p-4 rounded-lg">
                            <h3 className="font-semibold text-base">Calculated Amounts</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <FormLabel className="text-sm">Unloading Amount</FormLabel>
                                    <Input
                                        type="text"
                                        value={unloadingAmount}
                                        readOnly
                                        className="bg-background mt-1"
                                    />
                                </div>
                                <div>
                                    <FormLabel className="text-sm">Stacking Amount</FormLabel>
                                    <Input
                                        type="text"
                                        value={stackingAmount}
                                        readOnly
                                        className="bg-background mt-1"
                                    />
                                </div>
                                <div>
                                    <FormLabel className="text-sm font-semibold">Total Amount</FormLabel>
                                    <Input
                                        type="text"
                                        value={totalAmount}
                                        readOnly
                                        className="bg-background mt-1 font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createInwardLabor.isPending}
                            >
                                {createInwardLabor.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
