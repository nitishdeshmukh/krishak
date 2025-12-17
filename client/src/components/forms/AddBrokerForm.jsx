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
  const { t } = useTranslation(['entry', 'common']);
  const [isLoading, setIsLoading] = React.useState(false);

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

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Broker Form Data:', data);

    // Simulate API call
    setTimeout(() => {
      toast.success('Broker Added Successfully', {
        description: `${data.brokerName} has been added to the system.`,
      });
      setIsLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add Broker</CardTitle>
        <CardDescription>
          Enter broker details to add them to the system
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
                  <FormLabel>ब्रोकर का नाम *</FormLabel>
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
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>फोन न.</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm">
                        <span>🇮🇳</span>
                        <span className="text-gray-600">+91</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input 
                        placeholder="81234 56789" 
                        {...field}
                        className="pl-24 placeholder:text-gray-400"
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
                  <FormLabel>Email</FormLabel>
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
              <h3 className="text-sm font-medium">पता</h3>
              
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <FormControl>
                            <Button 
                              variant="outline" 
                              className="w-full justify-between font-normal text-gray-500"
                            >
                              {field.value || '-Select-'}
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
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
