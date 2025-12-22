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
import { useCreateGovPaddyInward } from '@/hooks/usePaddyInward';

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
  dhanMota: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  dhanPatla: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  dhanSarna: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  dhanMaha: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
  dhanRb: z.string().regex(/^\d*\.?\d*$/, {
    message: 'Must be a valid number.',
  }).optional(),
});

export default function AddGovPaddyInwardForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createGovPaddyInward = useCreateGovPaddyInward();

  // Sample data - Replace with actual data from API
  const doNumbers = ['DO-001', 'DO-002', 'DO-003', 'DO-004'];
  const samitiOptions = [
    { value: 'samiti1', label: 'समिति 1' },
    { value: 'samiti2', label: 'समिति 2' },
    { value: 'sangrahan1', label: 'संग्रहण केंद्र 1' },
    { value: 'sangrahan2', label: 'संग्रहण केंद्र 2' },
  ];
  const dhanTypes = [
    { value: 'mota', label: t('forms.govPaddyInward.dhanTypes.mota') || 'धान(मोटा)' },
    { value: 'patla', label: t('forms.govPaddyInward.dhanTypes.patla') || 'धान(पतला)' },
    { value: 'sarna', label: t('forms.govPaddyInward.dhanTypes.sarna') || 'धान(सरना)' },
    { value: 'mahamaya', label: t('forms.govPaddyInward.dhanTypes.mahamaya') || 'धान(महामाया)' },
  ];

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
      juteWeight: '',
      plasticWeight: '',
      gunnyWeight: '',
      truckNo: '',
      rstNo: '',
      truckLoadWeight: '',
      dhanType: 'mota',
      dhanMota: '',
      dhanPatla: '',
      dhanSarna: '',
      dhanMaha: '',
      dhanRb: '',
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doNumbers.map((doNo) => (
                        <SelectItem key={doNo} value={doNo}>
                          {doNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {samitiOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dhanTypes.map((type) => (
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

            {/* Dhan Mota Net Weight */}
            <FormField
              control={form.control}
              name="dhanMota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.dhanMota')}</FormLabel>
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

            {/* Dhan Patla Net Weight */}
            <FormField
              control={form.control}
              name="dhanPatla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.dhanPatla')}</FormLabel>
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

            {/* Dhan Sarna Net Weight */}
            <FormField
              control={form.control}
              name="dhanSarna"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.dhanSarna')}</FormLabel>
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

            {/* Dhan Mahamaya Net Weight */}
            <FormField
              control={form.control}
              name="dhanMaha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.dhanMaha')}</FormLabel>
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

            {/* Dhan RB Gold Net Weight */}
            <FormField
              control={form.control}
              name="dhanRb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.govPaddyInward.dhanRb')}</FormLabel>
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
                disabled={createGovPaddyInward.isPending}
              >
                {createGovPaddyInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
