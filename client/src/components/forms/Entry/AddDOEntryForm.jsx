import React, { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
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
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateDOEntry, useCreateBulkDOEntries, useUpdateDOEntry } from '@/hooks/useDOEntries';
import { useAllCommittees } from '@/hooks/useCommittee';
import { Upload, FileSpreadsheet, X, Check, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
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

// Form validation schema for manual entry
const doEntryFormSchema = z.object({
  committeeCenter: z.string().min(1, {
    message: 'कृपया समिति/संग्रहण केंद्र चुनें',
  }),
  doNumber: z.string().min(1, {
    message: 'DO क्रमांक आवश्यक है',
  }),
  date: z.date({
    required_error: 'दिनांक आवश्यक है',
  }),
  grainMota: z.string().regex(/^\d*\.?\d*$/, {
    message: 'मान्य संख्या दर्ज करें',
  }),
  grainPatla: z.string().regex(/^\d*\.?\d*$/, {
    message: 'मान्य संख्या दर्ज करें',
  }),
  grainSarna: z.string().regex(/^\d*\.?\d*$/, {
    message: 'मान्य संख्या दर्ज करें',
  }),
  total: z.string().optional(),
});

export default function DOEntryForm() {
  const { t } = useTranslation(['forms', 'common']);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if editing
  const { doEntry, isEditing } = location.state || {};
  
  const createDOEntryMutation = useCreateDOEntry();
  const createBulkDOEntriesMutation = useCreateBulkDOEntries();
  const updateDOEntryMutation = useUpdateDOEntry();

  // Fetch committees from server
  const { committees, isLoading: isLoadingCommittees } = useAllCommittees();

  // Transform committees into options for SearchableSelect
  const committeeOptions = React.useMemo(() =>
    committees.map(c => ({ value: c.committeeName, label: c.committeeName })),
    [committees]
  );

  // Mode state now handled by Tabs
  const [activeTab, setActiveTab] = useState('manual');

  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(doEntryFormSchema),
    defaultValues: {
      committeeCenter: '',
      doNumber: '',
      date: new Date(),
      grainMota: '0',
      grainPatla: '0',
      grainSarna: '0',
      total: '0',
    },
  });

  // Watch grain fields for auto-calculation
  const watchedFields = form.watch(['grainMota', 'grainPatla', 'grainSarna']);

  useEffect(() => {
    const [mota, patla, sarna] = watchedFields;
    const total = (parseFloat(mota) || 0) + (parseFloat(patla) || 0) + (parseFloat(sarna) || 0);
    // Format total to remove unnecessary decimals if integer
    form.setValue('total', total % 1 === 0 ? total.toString() : total.toFixed(2));
  }, [watchedFields, form]);

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && doEntry && !isLoadingCommittees && committees.length > 0) {
      console.log('Pre-filling form with doEntry:', doEntry);
      console.log('Committees available:', committees.map(c => c.committeeName));
      
      // Reset form with all values including committeeCenter
      // SearchableSelect will now handle displaying the value even if options aren't loaded yet
      form.reset({
        committeeCenter: doEntry.committeeCenter || '',
        doNumber: doEntry.doNumber || '',
        date: doEntry.date ? new Date(doEntry.date) : new Date(),
        grainMota: doEntry.grainMota?.toString() || '0',
        grainPatla: doEntry.grainPatla?.toString() || '0',
        grainSarna: doEntry.grainSarna?.toString() || '0',
        total: doEntry.total?.toString() || '0',
      });
    }
  }, [isEditing, doEntry, form, isLoadingCommittees, committees]);

  // Parse Excel file logic (kept consistent but cleaned up)
  const parseExcelFile = useCallback((file) => {
    setParseError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const entries = [];
        let lastCommitteeCenter = '';

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          if (row[0]) lastCommitteeCenter = row[0];
          const currentCommitteeCenter = row[0] || lastCommitteeCenter;
          const doNumber = row[2];

          if (doNumber) {
            let dateValue = row[3];
            if (typeof dateValue === 'number') {
              const excelDate = XLSX.SSF.parse_date_code(dateValue);
              dateValue = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
            }

            entries.push({
              id: i,
              committeeCenter: currentCommitteeCenter,
              doNumber: doNumber,
              date: dateValue || '',
              grainMota: row[4] || 0,
              grainPatla: row[5] || 0,
              grainSarna: row[6] || 0,
              total: row[7] || 0,
              isValid: !!(currentCommitteeCenter && doNumber),
            });
          }
        }

        if (entries.length === 0) {
          setParseError(t('common:doEntry.noValidData'));
        } else {
          setParsedData(entries);
        }
      } catch (error) {
        setParseError(t('common:doEntry.parseError'));
      }
    };
    reader.readAsArrayBuffer(file);
  }, [t]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.name.match(/\.(xlsx|xls)$/)) {
        setUploadedFile(file);
        parseExcelFile(file);
      } else {
        setParseError(t('common:doEntry.invalidFile'));
      }
    }
  }, [parseExcelFile, t]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      parseExcelFile(file);
    }
  }, [parseExcelFile]);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setParsedData([]);
    setParseError(null);
  }, []);

  // Manual Submit - Confirmed
  const handleConfirmedManualSubmit = async (data) => {
    try {
      const submitData = { ...data, date: format(data.date, 'yyyy-MM-dd') };
      if (isEditing && doEntry) {
        await updateDOEntryMutation.mutateAsync({ id: doEntry._id, data: submitData });
        toast.success('DO Entry Updated Successfully', {
          description: `DO ${submitData.doNumber} has been updated.`,
        });
        navigate('/reports/entry/do');
      } else {
        await createDOEntryMutation.mutateAsync(submitData);
        toast.success(t('common:doEntry.successSingle'));
        form.reset({
          committeeCenter: data.committeeCenter, // Keep last selected center
          doNumber: '',
          date: new Date(),
          grainMota: '0',
          grainPatla: '0',
          grainSarna: '0',
          total: '0',
        });
      }
    } catch (error) {
      toast.error(isEditing ? 'Failed to update DO entry' : t('common:doEntry.errorSubmit'));
    }
  };

  // Bulk Submit - Confirmed
  const handleConfirmedBulkSubmit = async () => {
    const validEntries = parsedData.filter(entry => entry.isValid);
    try {
      await createBulkDOEntriesMutation.mutateAsync(validEntries);
      toast.success(t('common:doEntry.successBulk', { count: validEntries.length }));
      clearFile();
    } catch (error) {
      toast.error(t('common:doEntry.errorBulk'));
    }
  };

  // Hooks for confirmation dialog
  const manualConfirm = useConfirmDialog('do-manual', handleConfirmedManualSubmit);
  const bulkConfirm = useConfirmDialog('do-bulk', handleConfirmedBulkSubmit);

  const onSubmit = async (data) => {
    manualConfirm.openDialog(data);
  };

  const handleBulkSubmit = async () => {
    const validEntries = parsedData.filter(entry => entry.isValid);
    if (validEntries.length === 0) return;
    bulkConfirm.openDialog(null); // No data needed specifically for bulk, state is in component
  };

  const removeEntry = (id) => {
    setParsedData(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        {isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <CardTitle>{isEditing ? 'Edit DO Entry' : t('forms:forms.doEntry.title')}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update DO entry details' : t('forms:forms.doEntry.description')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1">
            <TabsTrigger value="upload" className="py-2">
              <Upload className="w-4 h-4 mr-2" />
              {t('common:doEntry.excelUpload')}
            </TabsTrigger>
            <TabsTrigger value="manual" className="py-2">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {t('common:doEntry.manualEntry')}
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            {!uploadedFile ? (
              <div
                className={cn(
                  'cursor-pointer border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200',
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('excel-file-input').click()}
              >
                <input
                  id="excel-file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{t('common:doEntry.dropFileHere')}</h3>
                <p className="text-slate-500 mb-4">{t('common:doEntry.orClickToBrowse')}</p>
                <p className="text-xs text-slate-400 font-medium bg-slate-100 inline-block px-3 py-1 rounded-full">
                  {t('common:doEntry.fileFormat')}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FileSpreadsheet className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{uploadedFile.name}</p>
                      <p className="text-sm text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFile} className="hover:bg-red-50 hover:text-red-600">
                    <X className="h-4 w-4 mr-1" />
                    {t('common:buttons.remove')}
                  </Button>
                </div>

                {parseError && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
                    <AlertCircle className="h-5 w-5" />
                    <p>{parseError}</p>
                  </div>
                )}

                {parsedData.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="font-semibold text-slate-700">{t('common:doEntry.previewData')}</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded border shadow-sm">
                        {t('common:doEntry.totalEntries', { count: parsedData.length })}
                      </span>
                    </div>
                    <div className="max-h-[400px] overflow-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                          <tr>
                            <th className="p-3 font-medium">{t('common:doEntry.tableHeaders.committee')}</th>
                            <th className="p-3 font-medium">{t('common:doEntry.tableHeaders.doNumber')}</th>
                            <th className="p-3 font-medium">{t('common:doEntry.tableHeaders.date')}</th>
                            <th className="p-3 font-medium text-right">{t('common:doEntry.tableHeaders.coarse')}</th>
                            <th className="p-3 font-medium text-right">{t('common:doEntry.tableHeaders.fine')}</th>
                            <th className="p-3 font-medium text-right">{t('common:doEntry.tableHeaders.common')}</th>
                            <th className="p-3 font-medium text-right">{t('common:doEntry.tableHeaders.total')}</th>
                            <th className="p-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parsedData.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/50">
                              <td className="p-3">{entry.committeeCenter}</td>
                              <td className="p-3 font-medium text-blue-700">{entry.doNumber}</td>
                              <td className="p-3 text-slate-500">{entry.date}</td>
                              <td className="p-3 text-right">{entry.grainMota}</td>
                              <td className="p-3 text-right">{entry.grainPatla}</td>
                              <td className="p-3 text-right">{entry.grainSarna}</td>
                              <td className="p-3 text-right font-semibold">{entry.total}</td>
                              <td className="p-3 text-right">
                                <button onClick={() => removeEntry(entry.id)} className="text-slate-400 hover:text-red-500">
                                  <X className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                      <Button onClick={handleBulkSubmit} disabled={createBulkDOEntriesMutation.isPending} className="bg-blue-600 hover:bg-blue-700">
                        {createBulkDOEntriesMutation.isPending ? t('common:buttons.processing') : t('common:doEntry.submitEntries', { count: parsedData.length })}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Manual Tab */}
          <TabsContent value="manual">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Main Details Section - Single Column */}
                <div className="space-y-6 p-1">
                  {/* DO Number */}
                  <FormField
                    control={form.control}
                    name="doNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">{t('forms:forms.doEntry.doNumber')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('forms:forms.doEntry.doNumber')} {...field} className="h-11 border-slate-200 focus:border-blue-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date */}
                  <div className="pt-1">
                    <DatePickerField
                      name="date"
                      label={t('forms:forms.common.date')}
                    />
                  </div>
                </div>

                {/* Committee - Full Width */}
                <FormField
                  control={form.control}
                  name="committeeCenter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms:forms.doEntry.committeeCenter')}</FormLabel>
                      <FormControl>
                        <SearchableSelect
                          options={committeeOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t('forms:forms.common.selectPlaceholder')}
                          searchPlaceholder={t('common:buttons.search')}
                          isLoading={isLoadingCommittees}
                          emptyMessage={t('common:status.noResults')}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity Details Section */}

                <div className="space-y-4">
                  {/* Grain Mota */}
                  <FormField
                    control={form.control}
                    name="grainMota"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">{t('forms:forms.doEntry.grainCoarse')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Grain Patla */}
                  <FormField
                    control={form.control}
                    name="grainPatla"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">{t('forms:forms.doEntry.grainFine')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Grain Sarna */}
                  <FormField
                    control={form.control}
                    name="grainSarna"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">{t('forms:forms.doEntry.grainCommon')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Total */}
                  <FormField
                    control={form.control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">{t('common:doEntry.total')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            readOnly
                            className={cn('font-bold', 'bg-muted')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={createDOEntryMutation.isPending || updateDOEntryMutation.isPending}
                  >
                    {(createDOEntryMutation.isPending || updateDOEntryMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common:buttons.processing')}
                      </>
                    ) : (
                      isEditing ? 'Update' : t('common:buttons.submit')
                    )}
                  </Button>
                </div>

              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Manual Confirmation Dialog */}
      <AlertDialog open={manualConfirm.isOpen} onOpenChange={manualConfirm.closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('forms:forms.common.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('forms:forms.common.confirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('forms:forms.common.confirmNo')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={manualConfirm.handleConfirm}>
              {t('forms:forms.common.confirmYes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Confirmation Dialog */}
      <AlertDialog open={bulkConfirm.isOpen} onOpenChange={bulkConfirm.closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('forms:forms.common.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('forms:forms.common.confirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('forms:forms.common.confirmNo')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={bulkConfirm.handleConfirm}>
              {t('forms:forms.common.confirmYes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
