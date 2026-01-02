import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTransaction } from '@/hooks/useFinancialTransaction';
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

// Hooks
import { useAllParties } from '@/hooks/useParties';
import { useTransporters } from '@/hooks/useTransporters';
import { useAllBrokers } from '@/hooks/useBrokers';
import { useStaff } from '@/hooks/useStaff';
import { useTrucks } from '@/hooks/useTruck';
import { useLaborTeams } from '@/hooks/useLaborTeam';
import { useAllPurchasesByType } from '@/hooks/useAllPurchasesByType';
import { purchaseDealTypes, paymentModeOptions, hamaliTypes, monthOptions } from '@/lib/constants';

const paymentSchema = z.object({
    date: z.date(),
    paymentCategory: z.enum(['DEAL', 'TRANSPORT', 'HAMALI', 'SALARY', 'OTHER']),
    partyId: z.string().optional(),
    brokerId: z.string().optional(),
    transporterId: z.string().optional(),
    staffId: z.string().optional(),
    truckId: z.string().optional(),
    laborTeamId: z.string().optional(),
    dealType: z.string().optional(),
    dealId: z.string().optional(),
    transportMode: z.string().optional(),
    dieselAmount: z.string().optional(),
    allowanceAmount: z.string().optional(),
    repairAmount: z.string().optional(),
    hamaliType: z.string().optional(),
    month: z.string().optional(),
    attendance: z.string().optional(),
    allowedLeave: z.string().optional(),
    basicSalary: z.string().optional(),
    payableSalary: z.string().optional(),
    advanceAmount: z.string().optional(),
    amount: z.string().min(1, 'Amount is required'),
    paymentMode: z.string().min(1, 'Mode is required'),
    remarks: z.string().optional(),
});

export default function AddPaymentForm() {
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const createTransaction = useCreateTransaction();

    const { parties } = useAllParties();
    const { transporters } = useTransporters();
    const { brokers } = useAllBrokers();
    const { data: staffData } = useStaff();
    const { trucks } = useTrucks();
    const { data: laborTeams } = useLaborTeams();

    const form = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            date: new Date(),
            paymentCategory: '',
            partyId: '',
            brokerId: '',
            transporterId: '',
            staffId: '',
            truckId: '',
            laborTeamId: '',
            dealType: '',
            dealId: '',
            transportMode: '',
            dieselAmount: '',
            allowanceAmount: '',
            repairAmount: '',
            hamaliType: '',
            month: '',
            attendance: '0',
            allowedLeave: '0',
            basicSalary: '',
            payableSalary: '',
            advanceAmount: '0',
            amount: '',
            paymentMode: '',
            remarks: '',
        },
    });

    const partyOptions = parties?.map(p => ({ value: p._id, label: p.partyName })) || [];
    const brokerOptions = brokers?.map(b => ({ value: b._id, label: b.brokerName })) || [];
    const transporterOptions = transporters?.map(t => ({ value: t._id, label: t.transporterName })) || [];
    const staffOptions = staffData?.map(s => ({ value: s._id, label: s.name, salary: s.salary })) || [];
    const truckOptions = trucks?.map(t => ({ value: t._id, label: t.truckNumber })) || [];
    const laborTeamOptions = laborTeams?.map(lt => ({ value: lt._id, label: lt.name })) || [];

    const paymentCategory = form.watch('paymentCategory');
    const transportMode = form.watch('transportMode');
    const selectedStaffId = form.watch('staffId');
    const attendance = form.watch('attendance');
    const allowedLeave = form.watch('allowedLeave');
    const selectedDealType = form.watch('dealType');

    // Fetch purchase deals based on selected type
    const { purchases, isLoading: isLoadingPurchases } = useAllPurchasesByType(selectedDealType);

    // Convert purchases to options
    const dealOptions = React.useMemo(() =>
        (purchases || []).map(p => ({
            value: p._id,
            label: p.dealNumber || p.purchaseNumber || `Deal-${p._id?.slice(-6)}`
        })),
        [purchases]
    );

    // Reset dealId when dealType changes
    React.useEffect(() => {
        form.setValue('dealId', '');
    }, [selectedDealType, form]);

    // Salary Calculation
    useEffect(() => {
        if (paymentCategory === 'SALARY' && selectedStaffId) {
            const staff = staffData?.find(s => s._id === selectedStaffId);
            if (staff) {
                form.setValue('basicSalary', staff.salary?.toString() || '0');
                const daysInMonth = 30;
                const totalPresent = parseFloat(attendance || 0) + parseFloat(allowedLeave || 0);
                const salary = parseFloat(staff.salary || 0);
                const payable = (salary * totalPresent) / daysInMonth;
                form.setValue('payableSalary', payable.toFixed(2));
            }
        }
    }, [selectedStaffId, attendance, allowedLeave, paymentCategory, staffData, form]);

    const handleConfirmedSubmit = async (data) => {
        const payload = {
            ...data,
            transactionType: 'PAYMENT',
            date: format(data.date, 'yyyy-MM-dd'),
            amount: parseFloat(data.amount),
        };

        // Remove empty optional ObjectId fields to prevent MongoDB cast errors
        const optionalIdFields = ['partyId', 'brokerId', 'transporterId', 'staffId', 'truckId', 'laborTeamId', 'dealId'];
        optionalIdFields.forEach(field => {
            if (!payload[field]) delete payload[field];
        });

        // Remove empty optional string fields
        const optionalStringFields = ['dealType', 'transportMode', 'hamaliType', 'month', 'remarks'];
        optionalStringFields.forEach(field => {
            if (!payload[field]) delete payload[field];
        });

        if (data.dieselAmount) payload.dieselAmount = parseFloat(data.dieselAmount);
        if (data.allowanceAmount) payload.allowanceAmount = parseFloat(data.allowanceAmount);
        if (data.repairAmount) payload.repairAmount = parseFloat(data.repairAmount);

        if (data.paymentCategory === 'SALARY') {
            payload.salaryDetails = {
                month: data.month,
                basicSalary: parseFloat(data.basicSalary),
                attendance: parseFloat(data.attendance),
                allowedLeave: parseFloat(data.allowedLeave),
                payableSalary: parseFloat(data.payableSalary),
                advanceAmount: parseFloat(data.advanceAmount || 0),
            };
        }

        try {
            await createTransaction.mutateAsync(payload);
            toast.success(t('forms.payment.successMessage'));
            form.reset({
                date: new Date(),
                paymentCategory: paymentCategory,
                paymentMode: 'CASH',
                amount: '',
                remarks: '',
            });
        } catch (e) {
            toast.error(e.message);
        }
    };

    const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog('payment-save', handleConfirmedSubmit);

    const categoryOptions = [
        { value: 'DEAL', label: t('forms.payment.categories.deal') },
        { value: 'TRANSPORT', label: t('forms.payment.categories.transport') },
        { value: 'HAMALI', label: t('forms.payment.categories.hamali') },
        { value: 'SALARY', label: t('forms.payment.categories.salary') },
        { value: 'OTHER', label: t('forms.payment.categories.other') }
    ];

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{t('forms.payment.title')}</CardTitle>
                <CardDescription>{t('forms.payment.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(openDialog)} className="space-y-6">

                        {/* 1. Category Selection */}
                        <div className="space-y-2">
                            <FormLabel className="text-base font-semibold">{t('forms.payment.paymentCategory')}</FormLabel>
                            <RadioGroup
                                onValueChange={(val) => form.setValue('paymentCategory', val)}
                                defaultValue={paymentCategory}
                                className="flex flex-wrap gap-3"
                            >
                                {categoryOptions.map(opt => (
                                    <div
                                        key={opt.value}
                                        className={`flex items-center space-x-2 p-3 rounded-md border w-full md:w-auto cursor-pointer transition-colors ${paymentCategory === opt.value ? 'bg-accent border-primary' : 'bg-card hover:bg-muted'}`}
                                    >
                                        <RadioGroupItem value={opt.value} id={opt.value} />
                                        <FormLabel htmlFor={opt.value} className="cursor-pointer font-medium">{opt.label}</FormLabel>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="w-full md:w-1/3">
                            <DatePickerField name="date" label={t('forms.common.date')} />
                        </div>

                        {/* 2. Dynamic Content */}

                        {/* DEAL PAYMENT */}
                        {paymentCategory === 'DEAL' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/30">
                                <FormField control={form.control} name="partyId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.party')}</FormLabel>
                                        <FormControl><SearchableSelect options={partyOptions} value={field.value} onChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="brokerId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.broker')}</FormLabel>
                                        <FormControl><SearchableSelect options={brokerOptions} value={field.value} onChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="dealType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.dealType')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="सौदा प्रकार चुनें" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {purchaseDealTypes.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>{type.labelHi}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="dealId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.dealNumber')}</FormLabel>
                                        <FormControl>
                                            <SearchableSelect
                                                options={dealOptions}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder={isLoadingPurchases ? "Loading..." : "सौदा नंबर चुनें"}
                                                disabled={!selectedDealType || isLoadingPurchases}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        )}

                        {/* TRANSPORT PAYMENT */}
                        {paymentCategory === 'TRANSPORT' && (
                            <div className="space-y-4 border p-4 rounded-lg bg-muted/30">
                                <FormField control={form.control} name="transportMode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.transportMode')}</FormLabel>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="TRANSPORTER" id="tm1" /><FormLabel htmlFor="tm1">By Transporter</FormLabel></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="SELF" id="tm2" /><FormLabel htmlFor="tm2">Self</FormLabel></div>
                                        </RadioGroup>
                                    </FormItem>
                                )} />
                                {transportMode === 'TRANSPORTER' ? (
                                    <FormField control={form.control} name="transporterId" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">{t('forms.payment.transporterName')}</FormLabel>
                                            <FormControl><SearchableSelect options={transporterOptions} value={field.value} onChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )} />
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={form.control} name="truckId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">{t('forms.payment.truckNo')}</FormLabel>
                                                <FormControl><SearchableSelect options={truckOptions} value={field.value} onChange={field.onChange} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="dieselAmount" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">{t('forms.payment.diesel')} (₹)</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="allowanceAmount" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">{t('forms.payment.allowance')} (₹)</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control} name="repairAmount" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base">{t('forms.payment.repair')} (₹)</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* HAMALI PAYMENT */}
                        {paymentCategory === 'HAMALI' && (
                            <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/30">
                                <FormField control={form.control} name="hamaliType" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.hamaliType')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder={t('forms.common.selectPlaceholder')} /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {hamaliTypes.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="laborTeamId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.laborTeam')}</FormLabel>
                                        <FormControl><SearchableSelect options={laborTeamOptions} value={field.value} onChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        )}

                        {/* SALARY PAYMENT */}
                        {paymentCategory === 'SALARY' && (
                            <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/30">
                                <FormField control={form.control} name="staffId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.staffName')}</FormLabel>
                                        <FormControl><SearchableSelect options={staffOptions} value={field.value} onChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="month" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.month')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {monthOptions.map(m => (
                                                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="basicSalary" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Basic Salary</FormLabel>
                                        <FormControl><Input readOnly {...field} className="bg-muted" /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="attendance" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.attendance')} (Days)</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="allowedLeave" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.earnedLeave')}</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="payableSalary" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.payableSalary')}</FormLabel>
                                        <FormControl><Input readOnly {...field} className="bg-warning/10 font-semibold" /></FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="advanceAmount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">{t('forms.payment.advancePayment')}</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        )}

                        {/* 3. Amount & Mode */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.payment.amount')} (₹) *</FormLabel>
                                    <FormControl><Input type="number" step="0.01" className="text-lg font-semibold" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="paymentMode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">{t('forms.payment.paymentMode')} *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {paymentModeOptions.map(mode => (
                                                <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="remarks" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">{t('forms.payment.remarks')}</FormLabel>
                                <FormControl><Textarea {...field} className="placeholder:text-muted-foreground/60" /></FormControl>
                            </FormItem>
                        )} />

                        <Button
                            type="submit"
                            className="w-full md:w-auto"
                            disabled={createTransaction.isPending}
                        >
                            {createTransaction.isPending ? t('forms.common.saving') : t('forms.common.submit')}
                        </Button>
                    </form>
                </Form>

                <AlertDialog open={isOpen} onOpenChange={closeDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('forms.common.confirmTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>{t('forms.common.confirmMessage')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('forms.common.confirmNo')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm}>{t('forms.common.confirmYes')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
