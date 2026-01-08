import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
import { useCreateBroker, useUpdateBroker } from '@/hooks/useBrokers';
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
  address: z.string().optional(),
});

export default function AddBrokerForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're in edit mode
  const { broker, isEditing } = location.state || {};
  
  const createBrokerMutation = useCreateBroker();
  const updateBrokerMutation = useUpdateBroker();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(brokerFormSchema),
    defaultValues: {
      brokerName: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && broker) {
      form.reset({
        brokerName: broker.brokerName || '',
        phone: broker.phone || '',
        email: broker.email || '',
        address: broker.address || '',
      });
    }
  }, [isEditing, broker, form]);

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = async (data) => {
    try {
      if (isEditing && broker?._id) {
        await updateBrokerMutation.mutateAsync({ id: broker._id, data });
        toast.success('Broker Updated Successfully', {
          description: `${data.brokerName} has been updated.`,
        });
        navigate('/reports/entry/brokers');
      } else {
        await createBrokerMutation.mutateAsync(data);
        toast.success('Broker Added Successfully', {
          description: `${data.brokerName} has been added to the system.`,
        });
        form.reset();
      }
    } catch (error) {
      toast.error(isEditing ? 'Failed to update broker' : 'Failed to add broker', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    isEditing ? 'update-broker' : 'add-broker',
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        {isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <CardTitle>{isEditing ? 'Edit Broker' : t('forms.broker.title')}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update broker information' : t('forms.broker.description')}
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

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.broker.address')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full address..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={createBrokerMutation.isPending || updateBrokerMutation.isPending}
            >
              {(createBrokerMutation.isPending || updateBrokerMutation.isPending) 
                ? 'Submitting...' 
                : isEditing ? 'Update' : 'Submit'}
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
