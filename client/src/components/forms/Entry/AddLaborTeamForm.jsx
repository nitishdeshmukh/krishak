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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useCreateLaborTeam, useUpdateLaborTeam } from '@/hooks/useLaborTeam';
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
const laborTeamSchema = z.object({
    name: z.string().min(2, {
        message: 'Team name must be at least 2 characters.',
    }),
});

export default function AddLaborTeamForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const location = useLocation();
    const navigate = useNavigate();

    // Check if we're in edit mode
    const { laborTeam, isEditing } = location.state || {};

    const createTeamMutation = useCreateLaborTeam();
    const updateTeamMutation = useUpdateLaborTeam();

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(laborTeamSchema),
        defaultValues: {
            name: '',
        },
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (isEditing && laborTeam) {
            form.reset({
                name: laborTeam.name || '',
            });
        }
    }, [isEditing, laborTeam, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = async (data) => {
        try {
            if (isEditing && laborTeam?._id) {
                await updateTeamMutation.mutateAsync({ id: laborTeam._id, data });
                toast.success('Labor Team Updated Successfully', {
                    description: `${data.name} has been updated.`,
                });
                navigate('/reports/entry/labor-teams');
            } else {
                await createTeamMutation.mutateAsync(data);
                toast.success(t('forms.laborTeam.successMessage'), {
                    description: `${data.name} has been added to the system.`,
                });
                form.reset();
            }
        } catch (error) {
            toast.error(isEditing ? 'Failed to update labor team' : 'Failed to add labor team', {
                description: error.message || 'An error occurred.',
            });
        }
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        isEditing ? 'update-labor-team' : 'add-labor-team',
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
                <CardTitle>{isEditing ? 'Edit Labor Team' : t('forms.laborTeam.title')}</CardTitle>
                <CardDescription>
                    {isEditing ? 'Update labor team information' : t('forms.laborTeam.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Team Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.laborTeam.name')} *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter team name"
                                            {...field}
                                            className="placeholder:text-gray-400"
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
                            disabled={createTeamMutation.isPending || updateTeamMutation.isPending}
                        >
                            {(createTeamMutation.isPending || updateTeamMutation.isPending) 
                                ? t('forms.common.saving') 
                                : isEditing ? 'Update' : t('forms.common.submit')}
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
