import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronDown, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const doEntryFormSchema = z.object({
  committeeCenter: z.string().min(1, {
    message: 'Please select a committee/storage center.',
  }),
  doNumber: z.string().min(1, {
    message: 'DO number is required.',
  }),
  date: z.date({
    required_error: 'Date is required.',
  }),
  grainCoarse: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  grainFine: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  grainCommon: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
});

export default function DOEntryForm() {
  const { t } = useTranslation(['entry', 'common']);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sample committee/storage centers - Replace with actual data from API
  const committeeCenters = [
    'समिति केंद्र 1',
    'समिति केंद्र 2',
    'संग्रहण केंद्र 1',
    'संग्रहण केंद्र 2',
  ];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(doEntryFormSchema),
    defaultValues: {
      committeeCenter: '',
      doNumber: '',
      date: undefined,
      grainCoarse: '0',
      grainFine: '0',
      grainCommon: '0',
    },
  });

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('DO Entry Form Data:', {
      ...data,
      date: format(data.date, 'dd-MM-yy'),
    });

    // Simulate API call
    setTimeout(() => {
      toast.success('DO Entry Added Successfully', {
        description: `DO Number ${data.doNumber} has been added to the system.`,
      });
      setIsLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>DO Entry Form</CardTitle>
        <CardDescription>
          Enter delivery order details to add them to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Committee/Storage Center Dropdown */}
            <FormField
              control={form.control}
              name="committeeCenter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>समिति / संग्रहण केंद्र</FormLabel>
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
                      {committeeCenters.map((center) => (
                        <DropdownMenuItem 
                          key={center} 
                          onClick={() => field.onChange(center)}
                        >
                          {center}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DO Number */}
            <FormField
              control={form.control}
              name="doNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DO क्रमांक</FormLabel>
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

            {/* Date with Calendar */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>दिनांक</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-gray-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "dd-MM-yy")
                          ) : (
                            <span>dd-MM-yy</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain (Coarse) */}
            <FormField
              control={form.control}
              name="grainCoarse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>धान (मोटा)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0" 
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain (Fine) */}
            <FormField
              control={form.control}
              name="grainFine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>धान (पतला)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0" 
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain (Common) */}
            <FormField
              control={form.control}
              name="grainCommon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>धान (सरना)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0" 
                      {...field}
                      className="placeholder:text-gray-400"
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
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
