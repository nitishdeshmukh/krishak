"use client";

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
import { useCreateParty, useUpdateParty } from '@/hooks/useParties';
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
const partyFormSchema = z.object({
    partyName: z.string().optional(),
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

export default function AddPartyForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Check if we're in edit mode
    const { party, isEditing } = location.state || {};
    
    const createPartyMutation = useCreateParty();
    const updatePartyMutation = useUpdateParty();

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(partyFormSchema),
        defaultValues: {
            partyName: '',
            phone: '',
            email: '',
            gstn: '',
            address: '',
        },
    });

    // Pre-fill form when editing
    useEffect(() => {
        if (isEditing && party) {
            form.reset({
                partyName: party.partyName || '',
                phone: party.phone || '',
                email: party.email || '',
                gstn: party.gstn || '',
                address: party.address || '',
            });
        }
    }, [isEditing, party, form]);

    // Form submission handler - actual submission after confirmation
    const handleConfirmedSubmit = async (data) => {
        try {
            if (isEditing && party?._id) {
                await updatePartyMutation.mutateAsync({ id: party._id, data });
                toast.success('Party Updated Successfully', {
                    description: `${data.partyName} has been updated.`,
                });
                navigate('/reports/entry/parties');
            } else {
                await createPartyMutation.mutateAsync(data);
                toast.success('Party Added Successfully', {
                    description: `${data.partyName} has been added to the system.`,
                });
                form.reset();
            }
        } catch (error) {
            toast.error(isEditing ? 'Failed to update party' : 'Failed to add party', {
                description: error.message || 'An error occurred.',
            });
        }
    };

    // Hook for confirmation dialog
    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
        isEditing ? 'update-party' : 'add-party',
        handleConfirmedSubmit
    );

    // Form submission handler - shows confirmation dialog first
    const onSubmit = async (data) => {
        openDialog(data);
    };

    return (
        <Card className="max-w-3xl mx-auto">
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
                <CardTitle>{isEditing ? 'Edit Party' : t('forms.party.title')}</CardTitle>
                <CardDescription>
                    {isEditing ? 'Update party information' : t('forms.party.description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Party Name */}
                        <FormField
                            control={form.control}
                            name="partyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        {t('forms.party.partyName')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Number */}
                        <PhoneInputField
                            name="phone"
                            label={t('forms.party.phone')}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.party.email')}</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="" {...field} />
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
                                    <FormLabel className="text-base">{t('forms.party.gstNumber')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
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
                                        {t('forms.party.address')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Full Address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            disabled={createPartyMutation.isPending}
                        >
                            {createPartyMutation.isPending ? 'Submitting...' : 'Submit'}
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

