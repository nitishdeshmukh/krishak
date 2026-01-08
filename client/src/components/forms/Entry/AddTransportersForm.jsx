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
import { useCreateTransporter, useUpdateTransporter } from '@/hooks/useTransporters';
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
const transporterFormSchema = z.object({
  transporterName: z.string().min(2, {
    message: 'Transporter name must be at least 2 characters.',
  }).optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: 'Phone number must be 10 digits.',
  }).optional().or(z.literal('')),
  email: z.email({
    message: 'Please enter a valid email address.',
  }).optional().or(z.literal('')),
  gstn: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: 'Please enter a valid GSTN number.',
  }).optional().or(z.literal('')),
  address: z.string().optional(),
});

export default function AddTransportersForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're in edit mode
  const { transporter, isEditing } = location.state || {};
  
  const createTransporterMutation = useCreateTransporter();
  const updateTransporterMutation = useUpdateTransporter();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(transporterFormSchema),
    defaultValues: {
      transporterName: '',
      phone: '',
      email: '',
      gstn: '',
      address: '',
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && transporter) {
      form.reset({
        transporterName: transporter.transporterName || '',
        phone: transporter.phone || '',
        email: transporter.email || '',
        gstn: transporter.gstn || '',
        address: transporter.address || '',
      });
    }
  }, [isEditing, transporter, form]);

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = async (data) => {
    try {
      if (isEditing && transporter?._id) {
        await updateTransporterMutation.mutateAsync({ id: transporter._id, data });
        toast.success('Transporter Updated Successfully', {
          description: `${data.transporterName} has been updated.`,
        });
        navigate('/reports/entry/transporters');
      } else {
        await createTransporterMutation.mutateAsync(data);
        toast.success('Transporter Added Successfully', {
          description: `${data.transporterName} has been added to the system.`,
        });
        form.reset();
      }
    } catch (error) {
      toast.error(isEditing ? 'Failed to update transporter' : 'Failed to add transporter', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    isEditing ? 'update-transporter' : 'add-transporter',
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
        <CardTitle>{isEditing ? 'Edit Transporter' : t('forms.transporter.title')}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update transporter information' : t('forms.transporter.description')}
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

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.transporter.address')}</FormLabel>
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
              disabled={createTransporterMutation.isPending || updateTransporterMutation.isPending}
            >
              {(createTransporterMutation.isPending || updateTransporterMutation.isPending) 
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
