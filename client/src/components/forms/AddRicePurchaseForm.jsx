import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateRicePurchase } from '@/hooks/useRicePurchases';

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
  packaging: z.enum(['with-packaging', 'without-packaging'], {
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
  frk: z.enum(['frk-included', 'frk-give'], {
    required_error: 'Please select FRK option.',
  }),
  frkRate: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  lotNumber: z.string().optional(),
  riceInward: z.string().regex(/^\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  riceInwardBalance: z.string().regex(/^\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
});

export default function AddRicePurchaseForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createRicePurchaseMutation = useCreateRicePurchase();

  // Sample data - Replace with actual data from API
  const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
  const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];
  const riceTypes = ['चावल प्रकार 1', 'चावल प्रकार 2', 'चावल प्रकार 3'];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(ricePurchaseFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: '',
      brokerName: '',
      purchaseType: 'lot-purchase',
      riceType: '',
      quantity: '0',
      rate: '0',
      wastagePercent: '0',
      brokerage: '0',
      packaging: 'with-packaging',
      newPackagingRate: '',
      oldPackagingRate: '',
      plasticPackagingRate: '',
      frk: 'frk-included',
      frkRate: '',
      lotNumber: '',
      riceInward: '',
      riceInwardBalance: '',
    },
  });

  // Watch purchaseType to conditionally show LOT No. field
  const purchaseType = form.watch('purchaseType');

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      const submitData = { ...data, date: format(data.date, 'dd-MM-yy') };
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parties.map((party) => (
                        <SelectItem key={party} value={party}>
                          {party}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brokers.map((broker) => (
                        <SelectItem key={broker} value={broker}>
                          {broker}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      defaultValue={field.value}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {riceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      defaultValue={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-packaging" id="with-packaging" />
                        <Label htmlFor="with-packaging" className="font-normal cursor-pointer">
                          बारदाना सहित
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="without-packaging" id="without-packaging" />
                        <Label htmlFor="without-packaging" className="font-normal cursor-pointer">
                          बारदाना देना है
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* FRK Radio Buttons */}
            <FormField
              control={form.control}
              name="frk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.frk')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

            {/* FRK Rate */}
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

            {/* LOT No. - Conditional on purchaseType === 'lot-purchase' */}
            {purchaseType === 'lot-purchase' && (
              <FormField
                control={form.control}
                name="lotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('forms.ricePurchase.lotNumber')}</FormLabel>
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
            )}

            {/* Rice Inward */}
            <FormField
              control={form.control}
              name="riceInward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.riceInward')}</FormLabel>
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

            {/* Rice Inward Balance */}
            <FormField
              control={form.control}
              name="riceInwardBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.ricePurchase.riceInwardBalance')}</FormLabel>
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
      </CardContent>
    </Card>
  );
}
