import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { useCreateCommitteeMember } from '@/hooks/useCommittee';
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
const committeeProcurementFormSchema = z.object({
  type: z.enum(['committee-production', 'storage'], {
    required_error: 'Please select a type.',
  }),
  committeeName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

export default function AddCommitteeProcurementForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createCommitteeMemberMutation = useCreateCommitteeMember();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(committeeProcurementFormSchema),
    defaultValues: {
      type: 'committee-production',
      committeeName: '',
    },
  });

  // Form submission handler
  // Form submission handler - confirmed
  const handleConfirmedSubmit = async (data) => {
    try {
      await createCommitteeMemberMutation.mutateAsync(data);
      const typeLabel = data.type === 'committee-production' ? 'समिति-उपार्जन केंद्र' : 'संग्रहण केंद्र';
      toast.success('Committee Procurement Added Successfully', {
        description: `${data.committeeName} (${typeLabel}) has been added to the system.`,
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to add committee', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    'committee-procurement',
    handleConfirmedSubmit
  );

  // Form submission handler
  const onSubmit = async (data) => {
    openDialog(data);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.committee.title')}</CardTitle>
        <CardDescription>
          {t('forms.committee.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Type Selection - Radio Buttons */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.committee.type')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="committee-production" id="committee-production" />
                        <Label htmlFor="committee-production" className="font-normal cursor-pointer">
                          {t('forms.committee.types.center')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="storage" id="storage" />
                        <Label htmlFor="storage" className="font-normal cursor-pointer">
                          {t('forms.committee.types.storage')}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name Input */}
            <FormField
              control={form.control}
              name="committeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">{t('forms.committee.name')}</FormLabel>
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

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={createCommitteeMemberMutation.isPending}
              >
                {createCommitteeMemberMutation.isPending ? t('forms.common.saving') : t('forms.common.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

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
    </Card>
  );
}
