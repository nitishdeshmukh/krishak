import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
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
import { PhoneInputField } from '@/components/ui/phone-input-field';
import { useCreateTransporter } from '@/hooks/useTransporters';

// Form validation schema
const transporterFormSchema = z.object({
  transporterName: z.string().min(2, {
    message: 'Transporter name must be at least 2 characters.',
  }),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: 'Phone number must be 10 digits.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }).optional().or(z.literal('')),
  gstn: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: 'Please enter a valid GSTN number.',
  }).optional().or(z.literal('')),
  addressLine1: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, {
    message: 'City/District is required.',
  }),
  state: z.string().min(2, {
    message: 'State/Province is required.',
  }),
  postalCode: z.string().regex(/^[0-9]{6}$/, {
    message: 'Postal code must be 6 digits.',
  }),
  country: z.string().min(1, {
    message: 'Please select a country.',
  }),
});

export default function AddTransportersForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createTransporterMutation = useCreateTransporter();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(transporterFormSchema),
    defaultValues: {
      transporterName: '',
      phone: '',
      email: '',
      gstn: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      await createTransporterMutation.mutateAsync(data);
      toast.success('Transporter Added Successfully', {
        description: `${data.transporterName} has been added to the system.`,
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to add transporter', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.transporter.title')}</CardTitle>
        <CardDescription>
          {t('forms.transporter.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transporter Name */}
            <FormField
              control={form.control}
              name="transporterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.transporter.transporterName')} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <PhoneInputField
              name="phone"
              label={t('forms.transporter.phone')}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.transporter.email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GSTN */}
            <FormField
              control={form.control}
              name="gstn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.transporter.gstn')}</FormLabel>
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

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('forms.transporter.address')}</h3>

              {/* Address Line 1 */}
              <FormField
                control={form.control}
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Address Line 1"
                        {...field}
                        className="placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Line 2 */}
              <FormField
                control={form.control}
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Address Line 2"
                        {...field}
                        className="placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City and State Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="City / District"
                          {...field}
                          className="placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="State / Province"
                          {...field}
                          className="placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Postal Code and Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Postal Code"
                          {...field}
                          className="placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={createTransporterMutation.isPending}
            >
              {createTransporterMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
