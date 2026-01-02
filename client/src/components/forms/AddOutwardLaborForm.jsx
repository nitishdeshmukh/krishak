import React, { useState, useCallback, useEffect } from 'react';
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
import { useCreateOutwardLabor } from '@/hooks/useOutwardLabor';
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

// Import APIs to fetch outward records by truck number
// Note: Using existing Outward APIs to fetch truck numbers and bag details
import { fetchPrivatePaddyOutward } from '@/api/privatePaddyOutwardApi';
import { fetchPrivateRiceOutward } from '@/api/privateRiceOutwardApi';
import { fetchPrivateSackOutward } from '@/api/privateSackOutwardApi';
import { fetchFrkOutward } from '@/api/frkOutwardApi';
import { fetchOtherOutward } from '@/api/otherOutwardApi';

// Form validation schema
const outwardLaborFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    outwardType: z.enum(['paddy', 'rice', 'sack', 'frk', 'other'], {
        required_error: 'Please select outward type.',
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
    loadingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
    diulaiRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }),
    laborTeam: z.string().min(1, {
        message: 'Labor team name is required.',
    }),
});

export default function AddOutwardLaborForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createOutwardLabor = useCreateOutwardLabor();
    const [selectedOutwardType, setSelectedOutwardType] = useState('');
    const [truckOptions, setTruckOptions] = useState([]);
    const [selectedOutward, setSelectedOutward] = useState(null);

    // Initialize form
    const form = useForm({
        resolver: zodResolver(outwardLaborFormSchema),
        defaultValues: {
            date: new Date(),
            outwardType: '',
            truckNumber: '',
            totalBags: '',
            bundleCount: '',
            loadingRate: '',
            diulaiRate: '',
            laborTeam: '',
        },
    });

    // Watch fields for auto-calculation
    const [totalBags, loadingRate, diulaiRate] = form.watch(['totalBags', 'loadingRate', 'diulaiRate']);
    const [loadingAmount, setLoadingAmount] = useState('0.00');
    const [diulaiAmount, setDiulaiAmount] = useState('0.00');
    const [totalAmount, setTotalAmount] = useState('0.00');

    // Calculate amounts
    useEffect(() => {
        const bags = parseFloat(totalBags) || 0;
        const loading = parseFloat(loadingRate) || 0;
        const diulai = parseFloat(diulaiRate) || 0;

        const loadAmt = bags * loading;
        const diulaiAmt = bags * diulai;
        const total = loadAmt + diulaiAmt;

        setLoadingAmount(loadAmt.toFixed(2));
        setDiulaiAmount(diulaiAmt.toFixed(2));
        setTotalAmount(total.toFixed(2));
    }, [totalBags, loadingRate, diulaiRate]);

    // Fetch truck numbers when outward type changes
    const handleOutwardTypeChange = useCallback(async (type) => {
        setSelectedOutwardType(type);
        form.setValue('outwardType', type);
        form.setValue('truckNumber', '');
        form.setValue('totalBags', '');
        form.setValue('bundleCount', '');
        setSelectedOutward(null);

        try {
            let response;
            // Using Private Outward APIs as defaults for now, can be adjusted based on exact requirements (Govt/Private)
            switch (type) {
                case 'paddy':
                    response = await fetchPrivatePaddyOutward({});
                    break;
                case 'rice':
                    response = await fetchPrivateRiceOutward({});
                    break;
                case 'sack':
                    response = await fetchPrivateSackOutward({});
                    break;
                case 'frk':
                    response = await fetchFrkOutward({});
                    break;
                case 'other':
                    response = await fetchOtherOutward({});
                    break;
                default:
                    setTruckOptions([]);
                    return;
            }

            const outwardRecords = response?.data?.privatePaddyOutward || response?.data?.privateRiceOutward ||
                response?.data?.privateSackOutward || response?.data?.frkOutward ||
                response?.data?.otherOutward || [];

            const uniqueTrucks = [...new Set(outwardRecords.map(r => r.truckNo).filter(Boolean))];
            setTruckOptions(uniqueTrucks.map(truck => ({ value: truck, label: truck })));
        } catch (error) {
            console.error('Error fetching outward records:', error);
            toast.error('Failed to fetch truck numbers');
            setTruckOptions([]);
        }
    }, [form]);

    // Handle truck number selection - find the outward record and auto-fill bags
    const handleTruckNumberChange = useCallback(async (truckNumber) => {
        form.setValue('truckNumber', truckNumber);

        if (!truckNumber || !selectedOutwardType) {
            form.setValue('totalBags', '');
            form.setValue('bundleCount', '');
            setSelectedOutward(null);
            return;
        }

        try {
            let response;
            switch (selectedOutwardType) {
                case 'paddy':
                    response = await fetchPrivatePaddyOutward({});
                    break;
                case 'rice':
                    response = await fetchPrivateRiceOutward({});
                    break;
                case 'sack':
                    response = await fetchPrivateSackOutward({});
                    break;
                case 'frk':
                    response = await fetchFrkOutward({});
                    break;
                case 'other':
                    response = await fetchOtherOutward({});
                    break;
                default:
                    return;
            }

            const outwardRecords = response?.data?.privatePaddyOutward || response?.data?.privateRiceOutward ||
                response?.data?.privateSackOutward || response?.data?.frkOutward ||
                response?.data?.otherOutward || [];

            const record = outwardRecords.find(r => r.truckNo === truckNumber);
            if (record) {
                setSelectedOutward(record);
                // Auto-fill total bags - field names might vary across outward models (bags, totalBags, quantity etc.)
                const bags = record.totalBags || record.bags || record.gunnyNew || record.boriQuantity || record.quantity || 0;
                form.setValue('totalBags', bags.toString());

                // For sack outward, set bundle count if available
                if (selectedOutwardType === 'sack' && record.bundleCount) {
                    form.setValue('bundleCount', record.bundleCount.toString());
                }
            }
        } catch (error) {
            console.error('Error fetching outward details:', error);
        }
    }, [form, selectedOutwardType]);

    // Form submission handler
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
            totalBags: parseFloat(data.totalBags),
            bundleCount: data.bundleCount ? parseFloat(data.bundleCount) : 0,
            loadingRate: parseFloat(data.loadingRate),
            diulaiRate: parseFloat(data.diulaiRate),
            loadingAmount: parseFloat(loadingAmount),
            diulaiAmount: parseFloat(diulaiAmount),
            totalAmount: parseFloat(totalAmount),
        };

        createOutwardLabor.mutate(formattedData, {
            onSuccess: () => {
                toast.success('Outward Labor Added Successfully', {
                    description: `Labor record for ${data.laborTeam} has been created.`,
                });
                form.reset();
                setSelectedOutwardType('');
                setTruckOptions([]);
                setSelectedOutward(null);
            },
            onError: (error) => {
                toast.error('Error creating Outward Labor', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'outward-labor',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>जावक हमाली</CardTitle>
                <CardDescription>
                    Add outward labor cost details
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

                        {/* Outward Type Radio */}
                        <FormField
                            control={form.control}
                            name="outwardType"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base">Outward Type (आवक प्रकार)</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={handleOutwardTypeChange}
                                            value={selectedOutwardType}
                                            className="flex flex-wrap gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="paddy" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Paddy (धान जावक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="rice" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Rice (चावल जावक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="frk" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    FRK (FRK जावक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="sack" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Sack (बारदाना जावक)
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="other" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Other (अन्य जावक)
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
                                            disabled={!selectedOutwardType}
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
                        {selectedOutwardType === 'sack' && (
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

                        {/* Loading Rate */}
                        <FormField
                            control={form.control}
                            name="loadingRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Loading Rate (लोडिंग दर)</FormLabel>
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

                        {/* Diulai Rate */}
                        <FormField
                            control={form.control}
                            name="diulaiRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">Diulai Rate/Stacking (ढुलाई/स्टैकिंग दर)</FormLabel>
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
                                    <FormLabel className="text-sm">Loading Amount</FormLabel>
                                    <Input
                                        type="text"
                                        value={loadingAmount}
                                        readOnly
                                        className="bg-background mt-1"
                                    />
                                </div>
                                <div>
                                    <FormLabel className="text-sm">Diulai Amount</FormLabel>
                                    <Input
                                        type="text"
                                        value={diulaiAmount}
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
                                disabled={createOutwardLabor.isPending}
                            >
                                {createOutwardLabor.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
