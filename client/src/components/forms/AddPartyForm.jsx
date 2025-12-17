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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronDown } from 'lucide-react';

// Form validation schema
const partyFormSchema = z.object({
    partyName: z.string().min(2, {
        message: 'Party name must be at least 2 characters.',
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

export default function AddPartyForm() {
    const { t } = useTranslation(['entry', 'common']);
    const [isLoading, setIsLoading] = React.useState(false);

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
        setIsLoading(true);
        console.log('Party Form Data:', data);

        // Simulate API call
        setTimeout(() => {
            toast.success('Party Added Successfully', {
                description: `${data.partyName} has been added to the system.`,
            });
            setIsLoading(false);
            form.reset();
        }, 1500);
    };

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Add Party</CardTitle>
                <CardDescription>
                    Enter party details to add them to the system
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
                                        पार्टी का नाम <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone Number */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">फोन न.</FormLabel>
                                    <FormControl>
                                        <div className="flex">
                                            <div className="flex items-center gap-2 px-3 bg-muted border border-r-0 rounded-l-md">
                                                <span className="text-2xl">🇮🇳</span>
                                                <span className="text-sm font-medium">+91</span>
                                            </div>
                                            <Input
                                                type="tel"
                                                placeholder="81234 56789"
                                                className="rounded-l-none"
                                                {...field}
                                            />
                                        </div>
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
                                    <FormLabel className="text-base">Email</FormLabel>
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
                                    <FormLabel className="text-base">GSTN</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address Section */}
                        <div className="space-y-4">
                            <FormLabel className="text-base">पता</FormLabel>

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
                                            <FormControl>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-between font-normal"
                                                        >
                                                            {field.value || '-Select-'}
                                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-full" align="start">
                                                        <DropdownMenuItem onClick={() => field.onChange('India')}>
                                                            India
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange('USA')}>
                                                            USA
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange('UK')}>
                                                            UK
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange('Canada')}>
                                                            Canada
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => field.onChange('Australia')}>
                                                            Australia
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
                            className="w-full sm:w-auto"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
