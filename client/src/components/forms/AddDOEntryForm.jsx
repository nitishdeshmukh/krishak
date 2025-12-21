import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';

// Form validation schema
const doEntryFormSchema = z.object({
  committeeCenter: z.string().min(1, {
    message: 'Please select a committee/storage center.',
  }),
  doNumber: z.string().min(1, {
    message: 'DO number is required.',
  }),
  date: z.date({
    required_error: 'Date is required.',
  }),
  grainCoarse: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  grainFine: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  grainCommon: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
});

export default function DOEntryForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sample committee/storage centers - Replace with actual data from API
  const committeeCenters = [
    'समिति केंद्र 1',
    'समिति केंद्र 2',
    'संग्रहण केंद्र 1',
    'संग्रहण केंद्र 2',
  ];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(doEntryFormSchema),
    defaultValues: {
      committeeCenter: '',
      doNumber: '',
      date: new Date(),
      grainCoarse: '0',
      grainFine: '0',
      grainCommon: '0',
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('DO Entry Form Data:', {
      ...data,
      date: format(data.date, 'dd-MM-yy'),
    });

    // Simulate API call
    setTimeout(() => {
      toast.success('DO Entry Added Successfully', {
        description: `DO Number ${data.doNumber} has been added to the system.`,
      });
      setIsLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.doEntry.title')}</CardTitle>
        <CardDescription>
          {t('forms.doEntry.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date with Calendar */}
            <DatePickerField
              name="date"
              label={t('forms.doEntry.date')}
            />

            {/* Committee/Storage Center Dropdown */}
            <FormField
              control={form.control}
              name="committeeCenter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.doEntry.committeeCenter')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {committeeCenters.map((center) => (
                        <SelectItem key={center} value={center}>
                          {center}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DO Number */}
            <FormField
              control={form.control}
              name="doNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.doEntry.doNumber')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain (Coarse) */}
            <FormField
              control={form.control}
              name="grainCoarse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.doEntry.grainCoarse')}</FormLabel>
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

            {/* Grain (Fine) */}
            <FormField
              control={form.control}
              name="grainFine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.doEntry.grainFine')}</FormLabel>
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

            {/* Grain (Common) */}
            <FormField
              control={form.control}
              name="grainCommon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.doEntry.grainCommon')}</FormLabel>
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
                disabled={isLoading}
              >
                {isLoading ? t('forms.common.saving') : t('forms.common.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
