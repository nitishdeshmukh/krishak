import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Form,
  FormControl,
  FormDescription,
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
import { useCreateRicePurchase } from '@/hooks/useRicePurchases';
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
const ricePurchaseFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  partyName: z.string().min(1, {
    message: 'Please select a party.',
  }),
  brokerName: z.string().min(1, {
    message: 'Please select a broker.',
  }),
  purchaseType: z.enum(['lot-purchase', 'other-purchase'], {
    required_error: 'Please select purchase type.',
  }),
  riceType: z.string().min(1, {
    message: 'Please select rice type.',
  }),
  quantity: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }).refine((val) => parseFloat(val) > 0, {
    message: 'Quantity must be greater than 0.',
  }),
  rate: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  wastagePercent: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  brokerage: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
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
  fciNan: z.enum(['fci', 'nan'], {
    required_error: 'Please select FCI/NAN option.',
  }).optional(),
  frk: z.enum(['frk-included', 'frk-give'], {
    required_error: 'Please select FRK option.',
  }).optional(),
  frkRate: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  lotEntries: z.array(z.object({
    lotNumber: z.string().optional(),
  })).optional(),
});

export default function AddRicePurchaseForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createRicePurchaseMutation = useCreateRicePurchase();

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
    resolver: zodResolver(ricePurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: '',
      brokerName: '',
      purchaseType: '',
      riceType: '',
      quantity: '',
      rate: '',
      wastagePercent: '',
      brokerage: '',
      packaging: '',
      newPackagingRate: '',
      oldPackagingRate: '',
      plasticPackagingRate: '',
      fciNan: '',
      frk: '',
      frkRate: '',
      lotEntries: [{ lotNumber: '' }],
    },
  });

  // useFieldArray for multiple LOT entries
  const { fields: lotFields, append: appendLot, remove: removeLot } = useFieldArray({
    control: form.control,
    name: 'lotEntries',
  });

  // Watch purchaseType to conditionally show LOT fields
  const purchaseType = form.watch('purchaseType');

  // Watch frk to conditionally show FRK Rate field
  const frk = form.watch('frk');

  // Watch packaging to conditionally show packaging rate fields
  const packaging = form.watch('packaging');

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = async (data) => {
    try {
      const submitData = { ...data, date: format(data.date, 'yyyy-MM-dd') };
      await createRicePurchaseMutation.mutateAsync(submitData);
      toast.success('Rice Purchase Added Successfully', {
        description: `Purchase for ${data.partyName} has been recorded.`,
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to add rice purchase', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    'rice-purchase',
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.ricePurchase.title')}</CardTitle>
        <CardDescription>
          {t('forms.ricePurchase.description')}
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
                  <FormLabel className="text-base">{t('forms.ricePurchase.partyName')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.ricePurchase.brokerName')}</FormLabel>
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

            {/* Purchase Type Radio Buttons */}
            <FormField
              control={form.control}
              name="purchaseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.purchaseType')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lot-purchase" id="lot-purchase" />
                        <Label htmlFor="lot-purchase" className="font-normal cursor-pointer">
                          LOT खरीदी
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-purchase" id="other-purchase" />
                        <Label htmlFor="other-purchase" className="font-normal cursor-pointer">
                          अन्य खरीदी
                        </Label>
                      </div>
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
                  <FormLabel className="text-base">{t('forms.ricePurchase.riceType')}</FormLabel>
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

            {/* Quantity (Quintal) */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.quantity')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.ricePurchase.rate')}</FormLabel>
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

            {/* Wastage Percent */}
            <FormField
              control={form.control}
              name="wastagePercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.wastagePercent')}</FormLabel>
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

            {/* Brokerage (Per Quintal) */}
            <FormField
              control={form.control}
              name="brokerage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.brokerage')}</FormLabel>
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

            {/* Packaging Radio Buttons */}
            <FormField
              control={form.control}
              name="packaging"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.packaging')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-weight" id="with-weight" />
                        <Label htmlFor="with-weight" className="font-normal cursor-pointer">
                          सहित (वजन में)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-quantity" id="with-quantity" />
                        <Label htmlFor="with-quantity" className="font-normal cursor-pointer">
                          सहित (भाव में)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="return" id="return" />
                        <Label htmlFor="return" className="font-normal cursor-pointer">
                          वापसी
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Packaging Rate Fields - Only show when सहित (भाव में) is selected */}
            {packaging === 'with-quantity' && (
              <>
                {/* New Packaging Rate */}
                <FormField
                  control={form.control}
                  name="newPackagingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms.ricePurchase.newPackagingRate')}</FormLabel>
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

                {/* Old Packaging Rate */}
                <FormField
                  control={form.control}
                  name="oldPackagingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms.ricePurchase.oldPackagingRate')}</FormLabel>
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

                {/* Plastic Packaging Rate */}
                <FormField
                  control={form.control}
                  name="plasticPackagingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms.ricePurchase.plasticPackagingRate')}</FormLabel>
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

            {/* FCI/NAN Radio - Only show for LOT purchase */}
            {purchaseType === 'lot-purchase' && (
              <FormField
                control={form.control}
                name="fciNan"
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
                          <RadioGroupItem value="fci" id="fci" />
                          <Label htmlFor="fci" className="font-normal cursor-pointer">
                            FCI
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nan" id="nan" />
                          <Label htmlFor="nan" className="font-normal cursor-pointer">
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

            {/* FRK Radio Buttons - Only show for LOT purchase */}
            {purchaseType === 'lot-purchase' && (
              <FormField
                control={form.control}
                name="frk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('forms.ricePurchase.frk')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center gap-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="frk-included" id="frk-included" />
                          <Label htmlFor="frk-included" className="font-normal cursor-pointer">
                            FRK सहित
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="frk-give" id="frk-give" />
                          <Label htmlFor="frk-give" className="font-normal cursor-pointer">
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

            {/* FRK Rate - Only show when LOT purchase AND FRK सहित is selected */}
            {purchaseType === 'lot-purchase' && frk === 'frk-included' && (
              <FormField
                control={form.control}
                name="frkRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('forms.ricePurchase.frkRate')}</FormLabel>
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

            {/* LOT Entries - Multiple LOT No. fields */}
            {purchaseType === 'lot-purchase' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base">LOT No.</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendLot({ lotNumber: '' })}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    LOT जोड़ें
                  </Button>
                </div>

                {lotFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`lotEntries.${index}.lotNumber`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`LOT No. ${index + 1}`}
                              {...field}
                              className="placeholder:text-gray-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {lotFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLot(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}


            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={createRicePurchaseMutation.isPending}
              >
                {createRicePurchaseMutation.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
