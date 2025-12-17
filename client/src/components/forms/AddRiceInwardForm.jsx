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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronDown, CalendarIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Form validation schema
const riceInwardFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  purchaseSource: z.string().min(1, {
    message: 'Please select a rice purchase source.',
  }),
  fciNan: z.enum(['fci', 'nan'], {
    required_error: 'Please select FCI or NAN.',
  }),
  packaging: z.enum(['with-packaging', 'return-packaging'], {
    required_error: 'Please select packaging option.',
  }),
  packagingNew: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  packagingOld: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  packagingPlastic: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  totalPackaging: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  plasticPackagingWeight: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  packagingWeight: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  vehicleNumber: z.string().min(1, {
    message: 'Vehicle number is required.',
  }),
  rstNumber: z.string().optional(),
  vehicleWeight: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  riceCoarseNetWeight: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  riceFineNetWeight: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
});

export default function AddRiceInwardForm() {
  const { t } = useTranslation(['entry', 'common']);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sample rice purchase sources - Replace with actual data from API
  const ricePurchaseSources = ['चावल खरीदी स्रोत 1', 'चावल खरीदी स्रोत 2', 'चावल खरीदी स्रोत 3'];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(riceInwardFormSchema),
    defaultValues: {
      date: new Date(),
      purchaseSource: '',
      fciNan: 'fci',
      packaging: 'with-packaging',
      packagingNew: '0',
      packagingOld: '0',
      packagingPlastic: '0',
      totalPackaging: '.58',
      plasticPackagingWeight: '0.2',
      packagingWeight: '0.0000',
      vehicleNumber: '',
      rstNumber: '',
      vehicleWeight: '0',
      riceCoarseNetWeight: '0',
      riceFineNetWeight: '0',
    },
  });

  // Watch packaging values for auto-calculation
  const packagingNew = form.watch('packagingNew');
  const packagingOld = form.watch('packagingOld');
  const packagingPlastic = form.watch('packagingPlastic');
  const totalPackaging = form.watch('totalPackaging');
  const plasticPackagingWeight = form.watch('plasticPackagingWeight');

  // Auto-calculate packaging weight
  React.useEffect(() => {
    const newBags = parseInt(packagingNew) || 0;
    const oldBags = parseInt(packagingOld) || 0;
    const plasticBags = parseInt(packagingPlastic) || 0;
    const totalWeight = parseFloat(totalPackaging) || 0;
    const plasticWeight = parseFloat(plasticPackagingWeight) || 0;

    // Formula: ((new + old) * totalWeight + plastic * plasticWeight) / 100
    const totalWeightQuintal = ((newBags + oldBags) * totalWeight + plasticBags * plasticWeight) / 100;
    
    form.setValue('packagingWeight', totalWeightQuintal.toFixed(4));
  }, [packagingNew, packagingOld, packagingPlastic, totalPackaging, plasticPackagingWeight]);

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Rice Inward Form Data:', {
      ...data,
      date: format(data.date, 'dd-MM-yy'),
    });

    // Simulate API call
    setTimeout(() => {
      toast.success('Rice Inward Added Successfully', {
        description: `Inward from ${data.purchaseSource} has been recorded.`,
      });
      setIsLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add Rice Inward</CardTitle>
        <CardDescription>
          Enter rice inward details to add them to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            {/* Rice Purchase Source Dropdown */}
            <FormField
              control={form.control}
              name="purchaseSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>चावल खरीदी स्रोत क्रमांक</FormLabel>
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
                      {ricePurchaseSources.map((source) => (
                        <DropdownMenuItem 
                          key={source} 
                          onClick={() => field.onChange(source)}
                        >
                          {source}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* FCI/NAN Radio Buttons */}
            <FormField
              control={form.control}
              name="fciNan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FCI/NAN</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fci" id="fci" />
                        <Label htmlFor="fci" className="font-normal cursor-pointer">
                          FCI
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nan" id="nan" />
                        <Label htmlFor="nan" className="font-normal cursor-pointer">
                          NAN
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Packaging Radio Buttons */}
            <FormField
              control={form.control}
              name="packaging"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>बारदाना</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="with-packaging" id="with-packaging" />
                        <Label htmlFor="with-packaging" className="font-normal cursor-pointer">
                          बारदाना सहित
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="return-packaging" id="return-packaging" />
                        <Label htmlFor="return-packaging" className="font-normal cursor-pointer">
                          बारदाना देना है
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Packaging (New) */}
            <FormField
              control={form.control}
              name="packagingNew"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>बारदाना (नया)</FormLabel>
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

            {/* Packaging (Old) */}
            <FormField
              control={form.control}
              name="packagingOld"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>बारदाना (पुराना)</FormLabel>
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

            {/* Packaging (Plastic) */}
            <FormField
              control={form.control}
              name="packagingPlastic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>बारदाना (प्लास्टिक)</FormLabel>
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

            {/* Total Packaging */}
            <FormField
              control={form.control}
              name="totalPackaging"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जुट बारदाना वजन</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder=".58" 
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    बारदाना वजन कि.ग्रा. में बदलें करें (200 ग्राम=0.2 कि.ग्रा.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plastic Packaging Weight */}
            <FormField
              control={form.control}
              name="plasticPackagingWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>प्लास्टिक बारदाना वजन</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder="0.2" 
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    बारदाना वजन कि.ग्रा. में बदलें करें (200 ग्राम=0.2 कि.ग्रा.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Packaging Weight - Auto-calculated */}
            <FormField
              control={form.control}
              name="packagingWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>बारदाना वजन</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      placeholder="0.0000" 
                      {...field}
                      disabled
                      className="bg-gray-50 placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vehicle Number */}
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>गाड़ी नंबर</FormLabel>
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

            {/* RST Number */}
            <FormField
              control={form.control}
              name="rstNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RST No.</FormLabel>
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

            {/* Vehicle Weight */}
            <FormField
              control={form.control}
              name="vehicleWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>गाड़ी वजन</FormLabel>
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

            {/* Rice (Coarse) Net Weight */}
            <FormField
              control={form.control}
              name="riceCoarseNetWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>चावल(मोटा) नेट वजन</FormLabel>
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

            {/* Rice (Fine) Net Weight */}
            <FormField
              control={form.control}
              name="riceFineNetWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>चावल(पतला) नेट वजन</FormLabel>
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
