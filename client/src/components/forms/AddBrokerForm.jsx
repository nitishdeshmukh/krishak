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
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { PhoneInputField } from '@/components/ui/phone-input-field';
import { useCreateBroker } from '@/hooks/useBrokers';
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
const brokerFormSchema = z.object({
  brokerName: z.string().min(2, {
    message: 'Broker name must be at least 2 characters.',
  }),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: 'Phone number must be 10 digits.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
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

export default function AddBrokerForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createBrokerMutation = useCreateBroker();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(brokerFormSchema),
    defaultValues: {
      brokerName: '',
      phone: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
  });

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = async (data) => {
    try {
      await createBrokerMutation.mutateAsync(data);
      toast.success('Broker Added Successfully', {
        description: `${data.brokerName} has been added to the system.`,
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to add broker', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    'add-broker',
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.broker.title')}</CardTitle>
        <CardDescription>
          {t('forms.broker.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Broker Name */}
            <FormField
              control={form.control}
              name="brokerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.broker.brokerName')} *</FormLabel>
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
              label={t('forms.broker.phone')}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.broker.email')}</FormLabel>
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

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('forms.broker.address')}</h3>

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
                      <FormControl>
                        <SearchableSelect
                          options={[
                            { value: 'India', label: 'India' },
                            { value: 'USA', label: 'USA' },
                            { value: 'UK', label: 'UK' },
                            { value: 'Canada', label: 'Canada' },
                            { value: 'Australia', label: 'Australia' },
                          ]}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select"
                        />
                      </FormControl>
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
              disabled={createBrokerMutation.isPending}
            >
              {createBrokerMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
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
