import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateRiceSales } from '@/hooks/useRiceSales';
import { useAllParties } from '@/hooks/useParties';
import { useAllBrokers } from '@/hooks/useBrokers';
import { riceTypeOptions } from '@/lib/constants';
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
const riceSalesFormSchema = z.object({
    date: z.date({
        required_error: 'Date is required.',
    }),
    partyName: z.string().min(1, {
        message: 'Please select a party.',
    }),
    brokerName: z.string().min(1, {
        message: 'Please select a broker.',
    }),
    // LOT entries for multiple LOT entries
    lotEntries: z.array(z.object({
        lotNo: z.string().optional(),
    })).optional(),
    delivery: z.enum(['at-location', 'delivered'], {
        required_error: 'Please select delivery option.',
    }),
    saleType: z.enum(['fci', 'nan'], {
        required_error: 'Please select sale type.',
    }),
    riceType: z.string().min(1, {
        message: 'Please select rice type.',
    }),
    quantity: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    rate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    discountPercent: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    brokeragePerQuintal: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    packaging: z.enum(['with-weight', 'with-quantity', 'return'], {
        required_error: 'Please select packaging option.',
    }),
    newPackagingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    oldPackagingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    plasticPackagingRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    lotType: z.enum(['lot-sale', 'other-sale'], {
        required_error: 'Please select delivery type.',
    }),
    frk: z.enum(['frk-included', 'frk-give'], {
        required_error: 'Please select FRK option.',
    }).optional(),
    frkRate: z.string().regex(/^\d*\.?\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
    riceInward: z.string().regex(/^\d*$/, {
        message: 'Must be a valid number.',
    }).optional(),
});

export default function AddRiceSalesForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createRiceSales = useCreateRiceSales();

    // Fetch parties and brokers from server
    const { parties, isLoading: partiesLoading } = useAllParties();
    const { brokers, isLoading: brokersLoading } = useAllBrokers();

    // Convert to options format for SearchableSelect
    const partyOptions = useMemo(() =>
        parties.map(party => ({ value: party.partyName, label: party.partyName })),
        [parties]
    );

    const brokerOptions = useMemo(() =>
        brokers.map(broker => ({ value: broker.brokerName, label: broker.brokerName })),
        [brokers]
    );

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(riceSalesFormSchema),
        defaultValues: {
            date: new Date(),
            partyName: '',
            brokerName: '',
            lotType: '',
            lotEntries: [{ lotNo: '' }],
            delivery: '',
            saleType: '',
            riceType: '',
            quantity: '',
            rate: '',
            discountPercent: '',
            brokeragePerQuintal: '',
            packaging: '',
            newPackagingRate: '',
            oldPackagingRate: '',
            plasticPackagingRate: '',
            frk: '',
            frkRate: '',
            riceInward: '',
        },
    });

    // useFieldArray for multiple LOT entries
    const { fields: lotFields, append: appendLot, remove: removeLot } = useFieldArray({
        control: form.control,
        name: 'lotEntries',
    });

    // Watch lotType for conditional fields
    const lotType = form.watch('lotType');

    // Watch packaging to conditionally show packaging rate fields
    const packaging = form.watch('packaging');

    // Watch frk to conditionally show FRK Rate field
    const frk = form.watch('frk');

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = (data) => {
        const formattedData = {
            ...data,
            date: format(data.date, 'yyyy-MM-dd'),
        };

        createRiceSales.mutate(formattedData, {
            onSuccess: () => {
                toast.success(t('forms.riceSales.successMessage') || 'Rice Sales Added Successfully', {
                    description: `Sale for ${data.partyName} has been recorded.`,
                });
                form.reset();
            },
            onError: (error) => {
                toast.error('Error creating Rice Sales', {
                    description: error.message,
                });
            },
        });
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        'rice-sales',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.riceSales.title')}</CardTitle>
                <CardDescription>
                    {t('forms.riceSales.description')}
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

                        {/* Party Name Dropdown */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceSales.partyName')}</FormLabel>
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
                                    <FormLabel className="text-base">{t('forms.riceSales.brokerName')}</FormLabel>
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

                        {/* डिलीवरी (Delivery) Radio Buttons */}
                        <FormField
                            control={form.control}
                            name="delivery"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">डिलीवरी</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex items-center gap-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="at-location" id="at-location-rice" />
                                                <Label htmlFor="at-location-rice" className="font-normal cursor-pointer">
                                                    पड़े में
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="delivered" id="delivered-rice" />
                                                <Label htmlFor="delivered-rice" className="font-normal cursor-pointer">
                                                    पहुंचा कर
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Delivery Type Radio (LOT/अन्य) */}
                        <FormField
                            control={form.control}
                            name="lotType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">LOT/अन्य</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex items-center gap-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="lot-sale" id="lot-sale" />
                                                <Label htmlFor="lot-sale" className="font-normal cursor-pointer">
                                                    LOT बिक्री
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="other-sale" id="other-sale" />
                                                <Label htmlFor="other-sale" className="font-normal cursor-pointer">
                                                    अन्य
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* FCI/NAN - Only show for LOT बिक्री */}
                        {lotType === 'lot-sale' && (
                            <FormField
                                control={form.control}
                                name="saleType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">FCI/NAN</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="flex items-center gap-6"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="fci" id="fci-sale" />
                                                    <Label htmlFor="fci-sale" className="font-normal cursor-pointer">
                                                        FCI
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="nan" id="nan-sale" />
                                                    <Label htmlFor="nan-sale" className="font-normal cursor-pointer">
                                                        NAN
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* LOT Entries - Only show for LOT बिक्री */}
                        {lotType === 'lot-sale' && (
                            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-base font-semibold">LOT प्रविष्ट करें</FormLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => appendLot({ lotNo: '' })}
                                        className="flex items-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" />
                                        LOT जोड़ें
                                    </Button>
                                </div>

                                {lotFields.map((field, index) => (
                                    <div key={field.id} className="space-y-3 p-3 border rounded-md bg-background">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-muted-foreground">LOT Entry #{index + 1}</span>
                                            {lotFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeLot(index)}
                                                    className="text-destructive hover:text-destructive h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            {/* LOT No. */}
                                            <FormField
                                                control={form.control}
                                                name={`lotEntries.${index}.lotNo`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>LOT No.</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="LOT No. दर्ज करें"
                                                                {...field}
                                                                className="placeholder:text-gray-400"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Rice Type Dropdown */}
                        <FormField
                            control={form.control}
                            name="riceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceSales.riceType')}</FormLabel>
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

                        {/* Quantity */}
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceSales.quantity')}</FormLabel>
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

                        {/* Rate */}
                        <FormField
                            control={form.control}
                            name="rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceSales.rate')}</FormLabel>
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

                        {/* Discount Percent (बटाव %) */}
                        <FormField
                            control={form.control}
                            name="discountPercent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceSales.discountPercent')}</FormLabel>
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

                        {/* Brokerage Per Quintal */}
                        <FormField
                            control={form.control}
                            name="brokeragePerQuintal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceSales.brokeragePerQuintal')}</FormLabel>
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

                        {/* Packaging Radio */}
                        <FormField
                            control={form.control}
                            name="packaging"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.riceSales.packaging')}</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="flex items-center gap-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="with-weight" id="with-weight-sales" />
                                                <Label htmlFor="with-weight-sales" className="font-normal cursor-pointer">
                                                    सहित (वजन में)
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="with-quantity" id="with-quantity-sales" />
                                                <Label htmlFor="with-quantity-sales" className="font-normal cursor-pointer">
                                                    सहित (भाव में)
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="return" id="return-sales" />
                                                <Label htmlFor="return-sales" className="font-normal cursor-pointer">
                                                    वापसी
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* New Packaging Rate - Only show when सहित (भाव में) is selected */}
                        {packaging === 'with-quantity' && (
                            <FormField
                                control={form.control}
                                name="newPackagingRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.riceSales.newPackagingRate')}</FormLabel>
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
                        )}

                        {/* Old Packaging Rate - Only show when सहित (भाव में) is selected */}
                        {packaging === 'with-quantity' && (
                            <FormField
                                control={form.control}
                                name="oldPackagingRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.riceSales.oldPackagingRate')}</FormLabel>
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
                        )}

                        {/* Plastic Packaging Rate - Only show when सहित (भाव में) is selected */}
                        {packaging === 'with-quantity' && (
                            <FormField
                                control={form.control}
                                name="plasticPackagingRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.riceSales.plasticPackagingRate')}</FormLabel>
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
                        )}

                        {/* FRK Radio - Only show for LOT sale */}
                        {lotType === 'lot-sale' && (
                            <FormField
                                control={form.control}
                                name="frk"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">FRK</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="flex items-center gap-6"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="frk-included" id="frk-included-sale" />
                                                    <Label htmlFor="frk-included-sale" className="font-normal cursor-pointer">
                                                        FRK सहित
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="frk-give" id="frk-give-sale" />
                                                    <Label htmlFor="frk-give-sale" className="font-normal cursor-pointer">
                                                        FRK देना है
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* FRK Rate - Only show when LOT sale AND FRK सहित is selected */}
                        {lotType === 'lot-sale' && frk === 'frk-included' && (
                            <FormField
                                control={form.control}
                                name="frkRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">FRK दर (प्रति कि.)</FormLabel>
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
                        )}

                        {/* Rice Inward - Only show for LOT sale */}
                        {lotType === 'lot-sale' && (
                            <FormField
                                control={form.control}
                                name="riceInward"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">चावल आवक</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
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

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={createRiceSales.isPending}
                            >
                                {createRiceSales.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
