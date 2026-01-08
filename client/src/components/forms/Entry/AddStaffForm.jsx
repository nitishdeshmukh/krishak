import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateStaff, useUpdateStaff } from '@/hooks/useStaff';
import { toast } from 'sonner';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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

export default function AddStaffForm() {
    const { t } = useTranslation(['forms', 'common']);
    const navigate = useNavigate();
    const location = useLocation();
    const { staff, isEditing } = location.state || {};
    
    const createStaffMutation = useCreateStaff();
    const updateStaffMutation = useUpdateStaff();

    const form = useForm({
        defaultValues: {
            name: '',
            post: '',
            phone: '',
            email: '',
            address: '',
            salary: '',
        },
    });

    // Pre-fill form when editing
    React.useEffect(() => {
        if (isEditing && staff) {
            form.reset({
                name: staff.name || '',
                post: staff.post || '',
                phone: staff.phone || '',
                email: staff.email || '',
                address: staff.address || '',
                salary: staff.salary || '',
            });
        }
    }, [isEditing, staff, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = async (data) => {
        try {
            if (isEditing && staff) {
                await updateStaffMutation.mutateAsync({ id: staff._id, data });
                toast.success('Staff Updated', {
                    description: `${data.name} has been updated successfully.`,
                });
                navigate('/reports/entry/staff');
            } else {
                await createStaffMutation.mutateAsync(data);
                form.reset();
            }
        } catch (error) {
            console.error('Failed to save staff:', error);
            toast.error(isEditing ? 'Failed to update staff' : 'Failed to add staff');
        }
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        isEditing ? 'edit-staff' : 'add-staff',
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
                        onClick={() => navigate(-1)}
                        className="w-fit mb-2 -ml-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                )}
                <CardTitle>{isEditing ? 'Edit Staff' : t('forms.staff.title')}</CardTitle>
                <CardDescription>
                    {isEditing ? 'Update staff details' : t('forms.staff.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{ required: t('forms.common.required') }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('forms.staff.name')}
                                        <span className="text-destructive ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Post / Designation */}
                        <FormField
                            control={form.control}
                            name="post"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('forms.staff.post')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Manager" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Salary */}
                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('forms.staff.salary')}
                                    </FormLabel>
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

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('forms.staff.phone')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="9876543210" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('forms.staff.email')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@example.com" {...field} />
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
                                    <FormLabel className="text-base">
                                        {t('forms.staff.address')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center pt-4">
                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={form.formState.isSubmitting || createStaffMutation.isPending || updateStaffMutation.isPending}
                            >
                                {(form.formState.isSubmitting || createStaffMutation.isPending || updateStaffMutation.isPending)
                                    ? (isEditing ? 'Updating...' : t('forms.common.saving'))
                                    : (isEditing ? 'Update' : t('forms.common.save'))}
                            </Button>
                        </div>
                    </form>
                </Form>

                {/* Confirmation Dialog */}
                <AlertDialog open={isOpen} onOpenChange={closeDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('forms.common.confirmTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {isEditing
                                    ? "Are you sure you want to update this staff member's information?"
                                    : t('forms.common.confirmMessage')}
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
