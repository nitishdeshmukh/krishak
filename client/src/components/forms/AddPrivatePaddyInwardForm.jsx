import React, { useMemo, useState } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCreatePrivatePaddyInward } from '@/hooks/usePrivatePaddyInward';
import { useAllParties } from '@/hooks/useParties';
import { useAllBrokers } from '@/hooks/useBrokers';
import { useAllCommittees } from '@/hooks/useCommittee';
import { useAllDOEntries } from '@/hooks/useDOEntries';
import { useAllPaddyPurchases } from '@/hooks/usePaddyPurchases';
import { paddyTypeOptions } from '@/lib/constants';
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
const privatePaddyInwardFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  paddyPurchaseNumber: z.string().min(1, {
    message: 'Please select paddy purchase.',
  }),
  partyName: z.string().min(1, {
    message: 'Please select a party.',
  }),
  brokerName: z.string().min(1, {
    message: 'Please select a broker.',
  }),
  balDo: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  purchaseType: z.enum(['do-purchase', 'other-purchase'], {
    required_error: 'Please select purchase type.',
  }),
  doEntries: z.array(z.object({
    doNumber: z.string().optional(),
    samitiSangrahan: z.string().optional(),
  })).optional(),
  gunnyOption: z.enum(['with-weight', 'with-price', 'return'], {
    required_error: 'Please select sack option.',
  }),
  gunnyNew: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  gunnyOld: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  gunnyPlastic: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  juteWeight: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  plasticWeight: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  gunnyWeight: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  truckNo: z.string().min(1, {
    message: 'Truck number is required.',
  }),
  rstNo: z.string().optional(),
  truckLoadWeight: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  dhanType: z.string().min(1, {
    message: 'Please select paddy type.',
  }),
  dhanNetWeight: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
});

export default function AddPrivatePaddyInwardForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createPrivatePaddyInward = useCreatePrivatePaddyInward();
  const { parties, isLoading: isLoadingParties } = useAllParties();
  const { brokers, isLoading: isLoadingBrokers } = useAllBrokers();
  const { committees, isLoading: isLoadingCommittees } = useAllCommittees();
  const { doEntries, isLoading: isLoadingDO } = useAllDOEntries();
  const { paddyPurchases, isLoading: isLoadingPaddyPurchases } = useAllPaddyPurchases();

  // State for confirmation dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  // Memoized options for parties dropdown
  const partyOptions = useMemo(() => {
    if (!parties || parties.length === 0) return [];
    return parties.map(party => ({
      value: party._id || party.id,
      label: party.partyName || party.name
    }));
  }, [parties]);

  // Memoized options for brokers dropdown
  const brokerOptions = useMemo(() => {
    if (!brokers || brokers.length === 0) return [];
    return brokers.map(broker => ({
      value: broker._id || broker.id,
      label: broker.brokerName || broker.name
    }));
  }, [brokers]);

  // Memoized options for committees/samiti dropdown
  const samitiOptions = useMemo(() => {
    if (!committees || committees.length === 0) return [];
    return committees.map(committee => ({
      value: committee._id || committee.id,
      label: committee.name || committee.committeeName
    }));
  }, [committees]);

  // Memoized options for DO number dropdown
  const doNumberOptions = useMemo(() => {
    if (!doEntries || doEntries.length === 0) return [];
    return doEntries.map(entry => ({
      value: entry._id || entry.id,
      label: entry.doNumber || entry.doNo
    }));
  }, [doEntries]);

  // Memoized options for Paddy Purchase dropdown
  const paddyPurchaseOptions = useMemo(() => {
    if (!paddyPurchases || paddyPurchases.length === 0) return [];
    return paddyPurchases.map(purchase => ({
      value: purchase._id || purchase.id,
      label: purchase.paddyPurchaseNumber ? `${purchase.paddyPurchaseNumber}` : purchase.partyName
    }));
  }, [paddyPurchases]);

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(privatePaddyInwardFormSchema),
    defaultValues: {
      date: new Date(),
      paddyPurchaseNumber: '',
      partyName: '',
      brokerName: '',
      balDo: '',
      purchaseType: '',
      doEntries: [{ doNumber: '', samitiSangrahan: '' }],
      gunnyOption: '',
      gunnyNew: '',
      gunnyOld: '',
      gunnyPlastic: '',
      juteWeight: '0.58',
      plasticWeight: '0.135',
      gunnyWeight: '',
      truckNo: '',
      rstNo: '',
      truckLoadWeight: '',
      dhanType: '',
      dhanNetWeight: '',
    },
  });

  // useFieldArray for multiple DO entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'doEntries',
  });

  // Watch purchaseType to conditionally show DO fields
  const purchaseType = form.watch('purchaseType');

  // Watch dhanType for conditional net weight field
  const selectedDhanType = form.watch('dhanType');

  // Watch gunnyOption for conditional gunny count fields
  const gunnyOption = form.watch('gunnyOption');

  // Watch fields for auto-calculation
  const watchedFields = form.watch(['juteWeight', 'plasticWeight']);

  React.useEffect(() => {
    const [juteWeight, plasticWeight] = watchedFields;
    const jute = parseFloat(juteWeight) || 0;
    const plastic = parseFloat(plasticWeight) || 0;

    // Calculate total gunny weight
    const gunnyWeight = jute + plastic;

    if (gunnyWeight > 0) {
      form.setValue('gunnyWeight', gunnyWeight.toFixed(2));
    }
  }, [watchedFields, form]);

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  // Actual submission after confirmation
  const handleConfirmedSubmit = async () => {
    setShowConfirm(false);

    const formattedData = {
      ...pendingData,
      date: format(pendingData.date, 'yyyy-MM-dd'),
    };

    createPrivatePaddyInward.mutate(formattedData, {
      onSuccess: () => {
        toast.success(t('forms.privatePaddyInward.successMessage') || 'Private Paddy Inward Added Successfully', {
          description: `Inward for ${pendingData.partyName} has been recorded.`,
        });
        form.reset();
      },
      onError: (error) => {
        toast.error('Error creating Private Paddy Inward', {
          description: error.message,
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.privatePaddyInward.title')}</CardTitle>
        <CardDescription>
          {t('forms.privatePaddyInward.description')}
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

            {/* Paddy Purchase Number Dropdown */}
            <FormField
              control={form.control}
              name="paddyPurchaseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.paddyPurchaseNumber')}</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={paddyPurchaseOptions}
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.partyName')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.brokerName')}</FormLabel>
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

            {/* Balance DO */}
            <FormField
              control={form.control}
              name="balDo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.balDo')}</FormLabel>
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

            {/* Purchase Type Radio */}
            <FormField
              control={form.control}
              name="purchaseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.purchaseType')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="do-purchase" id="do-purchase" />
                        <Label htmlFor="do-purchase">{t('forms.privatePaddyInward.purchaseTypes.doPurchase') || 'DO खरीदी'}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-purchase" id="other-purchase" />
                        <Label htmlFor="other-purchase">{t('forms.privatePaddyInward.purchaseTypes.otherPurchase') || 'अन्य खरीदी'}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DO Entries SubForm - Only show when purchaseType is 'do-purchase' */}
            {purchaseType === 'do-purchase' && (
              <div className="space-y-4 p-4 border border-success/30 rounded-lg bg-success/5">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-success">{t('forms.privatePaddyInward.doInfo') || 'DO की जानकारी'}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ doNumber: '', samitiSangrahan: '' })}
                    className="text-success border-success/30 hover:bg-success/10"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    DO जोड़ें
                  </Button>
                </div>

                {fields.map((item, index) => (
                  <div key={item.id} className="space-y-4 p-4 border border-success/20 rounded-md bg-card relative">
                    {/* Entry Header with Delete Button */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-success">DO #{index + 1}</span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* DO Number */}
                    <FormField
                      control={form.control}
                      name={`doEntries.${index}.doNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">{t('forms.privatePaddyInward.doNumber') || 'DO क्रमांक'}</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              options={doNumberOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="DO चुनें"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Samiti/Sangrahan */}
                    <FormField
                      control={form.control}
                      name={`doEntries.${index}.samitiSangrahan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">{t('forms.privatePaddyInward.samitiSangrahan') || 'समिति/संग्रहण का नाम'}</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              options={samitiOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="समिति चुनें"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Gunny Option Radio */}
            <FormField
              control={form.control}
              name="gunnyOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.gunnyOption')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-weight" id="with-weight" />
                        <Label htmlFor="with-weight">{t('forms.privatePaddyInward.gunnyOptions.withWeight') || 'सहित (वजन में)'}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-price" id="with-price" />
                        <Label htmlFor="with-price">{t('forms.privatePaddyInward.gunnyOptions.withPrice') || 'सहित (भाव में)'}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="return" id="return" />
                        <Label htmlFor="return">{t('forms.privatePaddyInward.gunnyOptions.return') || 'वापसी'}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gunny Count Fields - Only show when gunnyOption is 'with-price' */}
            {(gunnyOption === 'with-price') && (
              <>
                {/* Gunny New */}
                <FormField
                  control={form.control}
                  name="gunnyNew"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms.privatePaddyInward.gunnyNew')}</FormLabel>
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
                      <FormLabel className="text-base">{t('forms.privatePaddyInward.gunnyOld')}</FormLabel>
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
                      <FormLabel className="text-base">{t('forms.privatePaddyInward.gunnyPlastic')}</FormLabel>
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
              </>
            )}

            {/* Jute Weight */}
            <FormField
              control={form.control}
              name="juteWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.juteWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.plasticWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.gunnyWeight')}</FormLabel>
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

            {/* Truck Number */}
            <FormField
              control={form.control}
              name="truckNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.truckNo')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.rstNo')}</FormLabel>
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

            {/* Truck Load Weight */}
            <FormField
              control={form.control}
              name="truckLoadWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.truckLoadWeight')}</FormLabel>
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

            {/* Dhan Type Dropdown */}
            <FormField
              control={form.control}
              name="dhanType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.dhanType')}</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={paddyTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="धान प्रकार चुनें"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamic Dhan Net Weight - Shows based on selected dhanType */}
            {selectedDhanType && (
              <FormField
                control={form.control}
                name="dhanNetWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {selectedDhanType} नेट वजन (क्विंटल में)
                    </FormLabel>
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

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={createPrivatePaddyInward.isPending}
              >
                {createPrivatePaddyInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
              </Button>
            </div>
          </form>
        </Form>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
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
              <AlertDialogAction onClick={handleConfirmedSubmit}>
                {t('forms.common.confirmYes')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
