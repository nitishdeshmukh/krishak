import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCreateTruck, useUpdateTruck } from '@/hooks/useTruck';
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

export default function AddVehicleForm() {
    const { t } = useTranslation(['forms', 'common']);
    const navigate = useNavigate();
    const location = useLocation();
    const { vehicle, isEditing } = location.state || {};
    
    const createTruckMutation = useCreateTruck();
    const updateTruckMutation = useUpdateTruck();

    const form = useForm({
        defaultValues: {
            truckNumber: '',
        },
    });
    
    // Pre-fill form when editing
    React.useEffect(() => {
        if (isEditing && vehicle) {
            form.reset({
                truckNumber: vehicle.truckNumber || '',
            });
        }
    }, [isEditing, vehicle, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = async (data) => {
        try {
            if (isEditing && vehicle) {
                await updateTruckMutation.mutateAsync({ id: vehicle._id, data });
                toast.success('Vehicle Updated', {
                    description: `${data.truckNumber} has been updated successfully.`,
                });
                navigate('/reports/entry/vehicles');
            } else {
                await createTruckMutation.mutateAsync(data);
                form.reset();
            }
        } catch (error) {
            console.error('Failed to save vehicle:', error);
            toast.error(isEditing ? 'Failed to update vehicle' : 'Failed to add vehicle');
        }
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        isEditing ? 'edit-vehicle' : 'add-truck',
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
                <CardTitle>{isEditing ? 'Edit Vehicle' : t('forms.truck.title')}</CardTitle>
                <CardDescription>
                    {isEditing ? 'Update vehicle details' : t('forms.truck.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="truckNumber"
                            rules={{ required: t('forms.common.required') }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('forms.truck.truckNumber')}
                                        <span className="text-destructive ml-1">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="CG 04 AB 1234" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center pt-4">

                            <Button
                                type="submit"
                                className="w-full md:w-auto px-8"
                                disabled={form.formState.isSubmitting || createTruckMutation.isPending || updateTruckMutation.isPending}
                            >
                                {(form.formState.isSubmitting || createTruckMutation.isPending || updateTruckMutation.isPending) 
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
                                    ? "Are you sure you want to update this vehicle's information?" 
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
