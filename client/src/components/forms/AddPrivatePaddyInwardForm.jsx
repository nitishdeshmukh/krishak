import React from 'react';
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
import { useCreatePrivatePaddyInward } from '@/hooks/usePrivatePaddyInward';

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

export default function AddPrivatePaddyInwardForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createPrivatePaddyInward = useCreatePrivatePaddyInward();

  // Sample data - Replace with actual data from API
  const paddyPurchases = ['PP-001', 'PP-002', 'PP-003', 'PP-004'];
  const parties = ['पार्टी 1', 'पार्टी 2', 'पार्टी 3'];
  const brokers = ['ब्रोकर 1', 'ब्रोकर 2', 'ब्रोकर 3'];
  const doNumbers = ['DO-001', 'DO-002', 'DO-003', 'DO-004'];
  const samitiOptions = [
    { value: 'samiti1', label: 'समिति 1' },
    { value: 'samiti2', label: 'समिति 2' },
    { value: 'sangrahan1', label: 'संग्रहण केंद्र 1' },
    { value: 'sangrahan2', label: 'संग्रहण केंद्र 2' },
  ];
  const dhanTypes = [
    { value: 'mota', label: t('forms.privatePaddyInward.dhanTypes.mota') || 'धान(मोटा)' },
    { value: 'patla', label: t('forms.privatePaddyInward.dhanTypes.patla') || 'धान(पतला)' },
    { value: 'sarna', label: t('forms.privatePaddyInward.dhanTypes.sarna') || 'धान(सरना)' },
    { value: 'mahamaya', label: t('forms.privatePaddyInward.dhanTypes.mahamaya') || 'धान(महामाया)' },
    { value: 'rbgold', label: t('forms.privatePaddyInward.dhanTypes.rbgold') || 'धान(RB GOLD)' },
  ];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(privatePaddyInwardFormSchema),
    defaultValues: {
      date: new Date(),
      paddyPurchaseNumber: '',
      partyName: '',
      brokerName: '',
      balDo: '',
      purchaseType: 'do-purchase',
      doEntries: [{ doNumber: '', samitiSangrahan: '' }],
      gunnyOption: 'with-weight',
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

  // useFieldArray for multiple DO entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'doEntries',
  });

  // Watch purchaseType to conditionally show DO fields
  const purchaseType = form.watch('purchaseType');

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

    createPrivatePaddyInward.mutate(formattedData, {
      onSuccess: () => {
        toast.success(t('forms.privatePaddyInward.successMessage') || 'Private Paddy Inward Added Successfully', {
          description: `Inward for ${data.partyName} has been recorded.`,
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paddyPurchases.map((pp) => (
                        <SelectItem key={pp} value={pp}>
                          {pp}
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.partyName')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.brokerName')}</FormLabel>
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
                      defaultValue={field.value}
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
                          <Select onValueChange={field.onChange} value={field.value}>
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

                    {/* Samiti/Sangrahan */}
                    <FormField
                      control={form.control}
                      name={`doEntries.${index}.samitiSangrahan`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">{t('forms.privatePaddyInward.samitiSangrahan') || 'समिति/संग्रहण का नाम'}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="समिति चुनें" />
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
                      defaultValue={field.value}
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.dhanMota')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.dhanPatla')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.dhanSarna')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.dhanMaha')}</FormLabel>
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
                  <FormLabel className="text-base">{t('forms.privatePaddyInward.dhanRb')}</FormLabel>
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
                disabled={createPrivatePaddyInward.isPending}
              >
                {createPrivatePaddyInward.isPending ? t('forms.common.saving') : t('forms.common.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
