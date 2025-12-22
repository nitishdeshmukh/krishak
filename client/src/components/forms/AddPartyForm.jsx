"use client";

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
import { useCreateParty } from '@/hooks/useParties';

// Form validation schema
const partyFormSchema = z.object({
    partyName: z.string().min(2, {
        message: 'Party name must be at least 2 characters.',
    }),
    phone: z.string().regex(/^[0-9]{10}$/, {
        message: 'Phone number must be 10 digits.',
    }),
    email: z.email({
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

export default function AddPartyForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createPartyMutation = useCreateParty();

    // Initialize form with react-hook-form and zod validation
    const form = useForm({
        resolver: zodResolver(partyFormSchema),
        defaultValues: {
            partyName: '',
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
            await createPartyMutation.mutateAsync(data);
            toast.success('Party Added Successfully', {
                description: `${data.partyName} has been added to the system.`,
            });
            form.reset();
        } catch (error) {
            toast.error('Failed to add party', {
                description: error.message || 'An error occurred while adding the party.',
            });
        }
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.party.title')}</CardTitle>
                <CardDescription>
                    {t('forms.party.description')}
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
                                        {t('forms.party.partyName')} <span className="text-red-500">*</span>
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

                        {/* Address Section */}
                        <div className="space-y-4">
                            <FormLabel className="text-base">{t('forms.party.address')}</FormLabel>

                            {/* Address Line 1 */}
                            <FormField
                                control={form.control}
                                name="addressLine1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Address Line 1" {...field} />
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
                                            <Input placeholder="Address Line 2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* City and State Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="City / District" {...field} />
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
                                                <Input placeholder="State / Province" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Postal Code and Country Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Postal Code" {...field} />
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
                            className="w-full sm:w-auto"
                            disabled={createPartyMutation.isPending}
                        >
                            {createPartyMutation.isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

