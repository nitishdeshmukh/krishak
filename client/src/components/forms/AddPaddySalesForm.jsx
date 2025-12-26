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
import { useCreatePaddySale } from '@/hooks/usePaddySales';
import { useAllParties } from '@/hooks/useParties';
import { useAllBrokers } from '@/hooks/useBrokers';
import { useAllCommittees } from '@/hooks/useCommittee';
import { paddyTypeOptions } from '@/lib/constants';
import { useAllDOEntries } from '@/hooks/useDOEntries';
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
const paddySalesFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  partyName: z.string().min(1, {
    message: 'Please select a party.',
  }),
  brokerName: z.string().min(1, {
    message: 'Please select a broker.',
  }),
  salesType: z.enum(['do-sales', 'other-sales'], {
    required_error: 'Please select sales type.',
  }),
  quantity: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  delivery: z.enum(['at-location', 'delivered'], {
    required_error: 'Please select delivery option.',
  }),
  doEntries: z.array(z.object({
    doNumber: z.string().optional(),
    dhanMota: z.string().regex(/^\d*\.?\d*$/, {
      message: 'Must be a valid number.',
    }).optional(),
    dhanPatla: z.string().regex(/^\d*\.?\d*$/, {
      message: 'Must be a valid number.',
    }).optional(),
    dhanSarna: z.string().regex(/^\d*\.?\d*$/, {
      message: 'Must be a valid number.',
    }).optional(),
  })).optional(),
  paddyType: z.string().min(1, {
    message: 'Please select paddy type.',
  }).optional(),
  paddyQuantity: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  paddyRate: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  wastagePercent: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  brokerage: z.string().regex(/^\d*\.?\d*$/, {
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
});

export default function AddPaddySalesForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createPaddySale = useCreatePaddySale();

  // Fetch parties, brokers, and committees from server
  const { parties, isLoading: partiesLoading } = useAllParties();
  const { brokers, isLoading: brokersLoading } = useAllBrokers();
  const { committees, isLoading: committeesLoading } = useAllCommittees();
  const { doEntries: allDOs } = useAllDOEntries();

  // Convert to options format for SearchableSelect
  const partyOptions = useMemo(() =>
    parties.map(party => ({ value: party.partyName, label: party.partyName })),
    [parties]
  );

  const brokerOptions = useMemo(() =>
    brokers.map(broker => ({ value: broker.brokerName, label: broker.brokerName })),
    [brokers]
  );

  const committeeOptions = useMemo(() =>
    committees.map(committee => ({ value: committee.committeeName, label: committee.committeeName })),
    [committees]
  );

  const doOptions = useMemo(() =>
    allDOs.map(doEntry => ({ value: doEntry.doNumber, label: doEntry.doNumber })),
    [allDOs]
  );

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(paddySalesFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: '',
      brokerName: '',
      salesType: '',
      quantity: '',
      delivery: '',
      doEntries: [{ doNumber: '', dhanMota: '', dhanPatla: '', dhanSarna: '' }],
      paddyType: '',
      paddyQuantity: '',
      paddyRate: '',
      wastagePercent: '',
      brokerage: '',
      packaging: '',
      newPackagingRate: '',
      oldPackagingRate: '',
      plasticPackagingRate: '',
    },
  });

  // useFieldArray for multiple DO entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'doEntries',
  });

  // Watch salesType to conditionally show DO entries
  const salesType = form.watch('salesType');

  // Watch packaging to conditionally show packaging rate fields
  const packaging = form.watch('packaging');

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = (data) => {
    const formattedData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    };

    createPaddySale.mutate(formattedData, {
      onSuccess: () => {
        toast.success('Paddy Sales Added Successfully', {
          description: `Sales for ${data.partyName} has been recorded.`,
        });
        form.reset();
      },
      onError: (error) => {
        toast.error('Error creating Paddy Sales', {
          description: error.message,
        });
      },
    });
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    'paddy-sales',
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  // Error handler for form validation
  const onInvalid = (errors) => {
    const errorFields = Object.keys(errors).map(key => t(`forms.paddySales.${key}`) || key).join(', ');
    toast.error(t('forms.common.validationError'), {
      description: `Missing or invalid fields: ${errorFields}`,
    });
    console.error("Form Validation Errors:", errors);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.paddySales.title')}</CardTitle>
        <CardDescription>
          {t('forms.paddySales.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
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
                  <FormLabel className="text-base">{t('forms.paddySales.partyName')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.paddySales.brokerName')}</FormLabel>
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

            {/* Sales Type Radio Buttons */}
            <FormField
              control={form.control}
              name="salesType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.paddySales.salesType')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="do-sales" id="do-sales" />
                        <Label htmlFor="do-sales" className="font-normal cursor-pointer">
                          DO बिक्री
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-sales" id="other-sales" />
                        <Label htmlFor="other-sales" className="font-normal cursor-pointer">
                          अन्य (मिल से बिक्री)
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* मात्रा (Quantity in Quintals) */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">मात्रा (क्विटल में.)</FormLabel>
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
                        <RadioGroupItem value="at-location" id="at-location" />
                        <Label htmlFor="at-location" className="font-normal cursor-pointer">
                          पड़े में
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivered" id="delivered" />
                        <Label htmlFor="delivered" className="font-normal cursor-pointer">
                          पहुंचा कर
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DO Entries - Only show for DO बिक्री */}
            {salesType === 'do-sales' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base font-semibold">DO प्रविष्ट करें</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ doNumber: '', dhanMota: '0', dhanPatla: '0', dhanSarna: '0' })}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    DO जोड़ें
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-3 p-3 border rounded-md bg-background">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">DO Entry #{index + 1}</span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* DO Number */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.doNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DO क्रमांक</FormLabel>
                            <FormControl>
                              <SearchableSelect
                                options={doOptions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select DO"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* धान (मोटा) */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.dhanMota`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>धान (मोटा)</FormLabel>
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

                      {/* धान (पतला) */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.dhanPatla`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>धान (पतला)</FormLabel>
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

                      {/* धान (सरना) */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.dhanSarna`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>धान (सरना)</FormLabel>
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
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paddy Type Dropdown - Only show for DO बिक्री */}
            {salesType === 'do-sales' && (
              <FormField
                control={form.control}
                name="paddyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">धान का प्रकार</FormLabel>
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
            )}

            {/* धान की मात्रा (Paddy Quantity) */}
            <FormField
              control={form.control}
              name="paddyQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">धान की मात्रा</FormLabel>
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

            {/* धान का भाव/दर (Paddy Rate) */}
            <FormField
              control={form.control}
              name="paddyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">धान का भाव/दर (प्रति क्विटल)</FormLabel>
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

            {/* बटाव % (Wastage Percent) */}
            <FormField
              control={form.control}
              name="wastagePercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">बटाव %</FormLabel>
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

            {/* दलाली (Brokerage) */}
            <FormField
              control={form.control}
              name="brokerage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">दलाली (प्रति क्विटल)</FormLabel>
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

            {/* बारदाना सहित/वापसी (Packaging) Radio Buttons */}
            <FormField
              control={form.control}
              name="packaging"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">बारदाना सहित/वापसी</FormLabel>
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

            {/* Packaging Rate Fields - Only show when packaging === 'with-quantity' */}
            {packaging === 'with-quantity' && (
              <>
                {/* नया बारदाना दर (New Packaging Rate) */}
                <FormField
                  control={form.control}
                  name="newPackagingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">नया बारदाना दर</FormLabel>
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

                {/* पुराना बारदाना दर (Old Packaging Rate) */}
                <FormField
                  control={form.control}
                  name="oldPackagingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">पुराना बारदाना दर</FormLabel>
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

                {/* प्लास्टिक बारदाना दर (Plastic Packaging Rate) */}
                <FormField
                  control={form.control}
                  name="plasticPackagingRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">प्लास्टिक बारदाना दर</FormLabel>
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
                disabled={createPaddySale.isPending}
              >
                {createPaddySale.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
