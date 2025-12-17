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
const govPaddyInwardFormSchema = z.object({
  date: z.date({
    required_error: 'Date is required.',
  }),
  doNumber: z.string().min(1, {
    message: 'DO number is required.',
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
  packagingWeightQuintal: z.string().regex(/^\d+(\.\d+)?$/, {
    message: 'Must be a valid number.',
  }),
  vehicleNumber: z.string().min(1, {
    message: 'Vehicle number is required.',
  }),
  rstNumber: z.string().optional(),
  vehicleWeightQuintal: z.string().regex(/^\d+$/, {
    message: 'Must be a valid number.',
  }),
  grainType: z.enum(['coarse', 'fine', 'common', 'maharaja', 'rb-gold'], {
    required_error: 'Please select grain type.',
  }),
});

export default function AddGovPaddyInwardForm() {
  const { t } = useTranslation(['entry', 'common']);
  const [isLoading, setIsLoading] = React.useState(false);

  // Sample DO numbers - Replace with actual data from API
  const doNumbers = ['DO001', 'DO002', 'DO003', 'DO004'];

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(govPaddyInwardFormSchema),
    defaultValues: {
      date: new Date(),
      doNumber: '',
      packagingNew: '0',
      packagingOld: '0',
      packagingPlastic: '0',
      totalPackaging: '.58',
      plasticPackagingWeight: '0.2',
      packagingWeightQuintal: '0.00000',
      vehicleNumber: '',
      rstNumber: '',
      vehicleWeightQuintal: '0',
      grainType: 'coarse',
    },
  });

  // Watch packaging values for auto-calculation
  const packagingNew = form.watch('packagingNew');
  const packagingOld = form.watch('packagingOld');
  const packagingPlastic = form.watch('packagingPlastic');
  const totalPackaging = form.watch('totalPackaging');
  const plasticPackagingWeight = form.watch('plasticPackagingWeight');

  // Auto-calculate packaging weight in quintal
  React.useEffect(() => {
    const newBags = parseInt(packagingNew) || 0;
    const oldBags = parseInt(packagingOld) || 0;
    const plasticBags = parseInt(packagingPlastic) || 0;
    const totalWeight = parseFloat(totalPackaging) || 0;
    const plasticWeight = parseFloat(plasticPackagingWeight) || 0;

    // Formula: ((new + old) * totalWeight + plastic * plasticWeight) / 100
    const totalWeightQuintal = ((newBags + oldBags) * totalWeight + plasticBags * plasticWeight) / 100;
    
    form.setValue('packagingWeightQuintal', totalWeightQuintal.toFixed(5));
  }, [packagingNew, packagingOld, packagingPlastic, totalPackaging, plasticPackagingWeight]);

  // Form submission handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    console.log('Government Paddy Inward Form Data:', {
      ...data,
      date: format(data.date, 'dd-MM-yy'),
    });

    // Simulate API call
    setTimeout(() => {
      toast.success('Government Paddy Inward Added Successfully', {
        description: `Inward for DO ${data.doNumber} has been recorded.`,
      });
      setIsLoading(false);
      form.reset();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add Government Paddy Inward</CardTitle>
        <CardDescription>
          Enter government paddy inward details to add them to the system
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

            {/* DO Number Dropdown */}
            <FormField
              control={form.control}
              name="doNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DO क्रमांक</FormLabel>
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
                      {doNumbers.map((doNum) => (
                        <DropdownMenuItem 
                          key={doNum} 
                          onClick={() => field.onChange(doNum)}
                        >
                          {doNum}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
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

            {/* Packaging Weight (Quintal) - Auto-calculated */}
            <FormField
              control={form.control}
              name="packagingWeightQuintal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>बारदाना वजन (क्विंटल में.)</FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      placeholder="0.00000" 
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

            {/* Vehicle Weight (Quintal) */}
            <FormField
              control={form.control}
              name="vehicleWeightQuintal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>गाड़ी वजन (क्विंटल में.)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="0" 
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    मात्रा (क्विंटल में.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grain Type Radio Buttons */}
            <FormField
              control={form.control}
              name="grainType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>आवक धान का प्रकार</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="coarse" id="coarse" />
                        <Label htmlFor="coarse" className="font-normal cursor-pointer">
                          धान(मोटा)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fine" id="fine" />
                        <Label htmlFor="fine" className="font-normal cursor-pointer">
                          धान(पतला)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="common" id="common" />
                        <Label htmlFor="common" className="font-normal cursor-pointer">
                          धान(सरना)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maharaja" id="maharaja" />
                        <Label htmlFor="maharaja" className="font-normal cursor-pointer">
                          धान(महामाया)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rb-gold" id="rb-gold" />
                        <Label htmlFor="rb-gold" className="font-normal cursor-pointer">
                          धान(RB GOLD)
                        </Label>
                      </div>
                    </RadioGroup>
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
