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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCreateRiceInward } from '@/hooks/useRiceInward';

// Form validation schema
const riceInwardFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  ricePurchaseNumber: z.string().min(1, {
    message: 'Please select rice purchase.',
  }),
  partyName: z.string().min(1, {
    message: 'Please select a party.',
  }),
  brokerName: z.string().min(1, {
    message: 'Please select a broker.',
  }),
  riceType: z.string().min(1, {
    message: 'Please select rice type.',
  }),
  awakBalance: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  lotType: z.enum(['lot-purchase', 'rice-purchase'], {
    required_error: 'Please select inward/LOT type.',
  }),
  lotNo: z.string().optional(),
  frkNon: z.enum(['frk', 'non-frk'], {
    required_error: 'Please select FRK/NON FRK.',
  }),
  gunnyOption: z.enum(['with-sack', 'give-sack'], {
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
  riceMota: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  ricePatla: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
});

export default function AddRiceInwardForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createRiceInward = useCreateRiceInward();

  // Sample data - Replace with actual data from API
  const ricePurchases = ['RP-001', 'RP-002', 'RP-003', 'RP-004'];
  const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
  const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];
  const riceTypes = [
    { value: 'mota', label: t('forms.riceInward.riceTypes.mota') || 'चावल(मोटा)' },
    { value: 'patla', label: t('forms.riceInward.riceTypes.patla') || 'चावल(पतला)' },
  ];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(riceInwardFormSchema),
    defaultValues: {
      date: new Date(),
      ricePurchaseNumber: '',
      partyName: '',
      brokerName: '',
      riceType: 'mota',
      awakBalance: '',
      lotType: 'lot-purchase',
      lotNo: '',
      frkNon: 'frk',
      gunnyOption: 'with-sack',
      gunnyNew: '',
      gunnyOld: '',
      gunnyPlastic: '',
      juteWeight: '',
      plasticWeight: '',
      gunnyWeight: '',
      truckNo: '',
      rstNo: '',
      truckLoadWeight: '',
      riceMota: '',
      ricePatla: '',
    },
  });

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

  // Form submission handler
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      date: format(data.date, 'dd-MM-yy'),
    };

    createRiceInward.mutate(formattedData, {
      onSuccess: () => {
        toast.success(t('forms.riceInward.successMessage') || 'Rice Inward Added Successfully', {
          description: `Inward for ${data.partyName} has been recorded.`,
        });
        form.reset();
      },
      onError: (error) => {
        toast.error('Error creating Rice Inward', {
          description: error.message,
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.riceInward.title')}</CardTitle>
        <CardDescription>
          {t('forms.riceInward.description')}
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

            {/* Rice Purchase Number Dropdown */}
            <FormField
              control={form.control}
              name="ricePurchaseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.ricePurchaseNumber')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ricePurchases.map((rp) => (
                        <SelectItem key={rp} value={rp}>
                          {rp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <FormLabel className="text-base">{t('forms.riceInward.partyName')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.brokerName')}</FormLabel>
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

            {/* Rice Type Dropdown */}
            <FormField
              control={form.control}
              name="riceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.riceType')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {riceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Awak Balance / LOT Jama Shesh */}
            <FormField
              control={form.control}
              name="awakBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.awakBalance')}</FormLabel>
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

            {/* LOT Type Radio */}
            <FormField
              control={form.control}
              name="lotType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.lotType')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lot-purchase" id="lot-purchase" />
                        <Label htmlFor="lot-purchase">{t('forms.riceInward.lotTypes.lotPurchase') || 'LOT खरीदी'}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rice-purchase" id="rice-purchase" />
                        <Label htmlFor="rice-purchase">{t('forms.riceInward.lotTypes.ricePurchase') || 'चावल खरीदी'}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LOT No */}
            <FormField
              control={form.control}
              name="lotNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.lotNo')}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="LOT No."
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FRK / NON FRK Radio */}
            <FormField
              control={form.control}
              name="frkNon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.frkNon')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="frk" id="frk" />
                        <Label htmlFor="frk">{t('forms.riceInward.frkOptions.frk') || 'FRK'}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non-frk" id="non-frk" />
                        <Label htmlFor="non-frk">{t('forms.riceInward.frkOptions.nonFrk') || 'NON FRK'}</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gunny Option Radio */}
            <FormField
              control={form.control}
              name="gunnyOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.gunnyOption')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-sack" id="with-sack" />
                        <Label htmlFor="with-sack">{t('forms.riceInward.gunnyOptions.withSack') || 'बारदाना सहित'}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="give-sack" id="give-sack" />
                        <Label htmlFor="give-sack">{t('forms.riceInward.gunnyOptions.giveSack') || 'बारदाना देना है'}</Label>
                      </div>
                    </RadioGroup>
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
                  <FormLabel className="text-base">{t('forms.riceInward.gunnyNew')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.gunnyOld')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.gunnyPlastic')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.juteWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.plasticWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.gunnyWeight')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.truckNo')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.rstNo')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.riceInward.truckLoadWeight')}</FormLabel>
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

            {/* Rice Mota Net Weight */}
            <FormField
              control={form.control}
              name="riceMota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.riceMota')}</FormLabel>
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

            {/* Rice Patla Net Weight */}
            <FormField
              control={form.control}
              name="ricePatla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.riceInward.ricePatla')}</FormLabel>
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

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={createRiceInward.isPending}
              >
                {createRiceInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
