import React, { useMemo } from 'react';
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
import { useCreateGovPaddyInward } from '@/hooks/usePaddyInward';
import { useAllCommittees } from '@/hooks/useCommittee';
import { useAllDOEntries } from '@/hooks/useDOEntries';
import { paddyTypeOptions } from '@/lib/constants';
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
const govPaddyInwardFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  doNumber: z.string().min(1, {
    message: 'DO number is required.',
  }),
  samitiSangrahan: z.string().min(1, {
    message: 'Please select Samiti/Sangrahan.',
  }),
  balDo: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
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

export default function AddGovPaddyInwardForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createGovPaddyInward = useCreateGovPaddyInward();
  const { committees, isLoading: isLoadingCommittees } = useAllCommittees();
  const { doEntries, isLoading: isLoadingDO } = useAllDOEntries();

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

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(govPaddyInwardFormSchema),
    defaultValues: {
      date: new Date(),
      doNumber: '',
      samitiSangrahan: '',
      balDo: '',
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

  // Watch dhanType for conditional net weight field
  const selectedDhanType = form.watch('dhanType');

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

  // Actual submit function after confirmation
  const handleConfirmedSubmit = (data) => {
    const formattedData = {
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    };

    createGovPaddyInward.mutate(formattedData, {
      onSuccess: () => {
        toast.success(t('forms.govPaddyInward.successMessage') || 'Government Paddy Inward Added Successfully', {
          description: `Inward for ${data.doNumber} has been recorded.`,
        });
        form.reset();
      },
      onError: (error) => {
        toast.error('Error creating Government Paddy Inward', {
          description: error.message,
        });
      },
    });
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    'gov-paddy-inward',
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.govPaddyInward.title')}</CardTitle>
        <CardDescription>
          {t('forms.govPaddyInward.description')}
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

            {/* DO Number Dropdown */}
            <FormField
              control={form.control}
              name="doNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.doNumber')}</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={doNumberOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Samiti/Sangrahan Dropdown */}
            <FormField
              control={form.control}
              name="samitiSangrahan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.samitiSangrahan')}</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={samitiOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bal DO (Balance DO) */}
            <FormField
              control={form.control}
              name="balDo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.balDo')}</FormLabel>
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

            {/* Gunny New */}
            <FormField
              control={form.control}
              name="gunnyNew"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.gunnyNew')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.gunnyOld')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.gunnyPlastic')}</FormLabel>
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

            {/* Jute Weight */}
            <FormField
              control={form.control}
              name="juteWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.juteWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.plasticWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.gunnyWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.truckNo')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.rstNo')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.truckLoadWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.govPaddyInward.dhanType')}</FormLabel>
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
                disabled={createGovPaddyInward.isPending}
              >
                {createGovPaddyInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
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
