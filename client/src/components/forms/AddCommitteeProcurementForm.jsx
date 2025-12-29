import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { useCreateCommitteeMember, useCreateBulkCommitteeMembers } from '@/hooks/useCommittee';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { Upload, FileSpreadsheet, X, AlertCircle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
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
const committeeProcurementFormSchema = z.object({
  type: z.enum(['committee-production', 'storage'], {
    required_error: 'Please select a type.',
  }),
  committeeName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

export default function AddCommitteeProcurementForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createCommitteeMemberMutation = useCreateCommitteeMember();
  const createBulkCommitteeMembersMutation = useCreateBulkCommitteeMembers();

  // Tab state
  const [activeTab, setActiveTab] = useState('manual');

  // Upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(committeeProcurementFormSchema),
    defaultValues: {
      type: 'committee-production',
      committeeName: '',
    },
  });

  // Parse Excel file
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

        // Skip header row (i = 0), start from i = 1
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;

          // Column A: Type (समिति-उपार्जन केंद्र or संग्रहण केंद्र)
          // Column B: Name
          const typeValue = row[0]?.toString().trim();
          const nameValue = row[1]?.toString().trim();

          if (typeValue && nameValue) {
            // Determine type based on value
            let type = 'committee-production';
            if (typeValue.includes('संग्रहण')) {
              type = 'storage';
            }

            entries.push({
              id: i,
              type: type,
              typeDisplay: typeValue,
              committeeName: nameValue,
              isValid: true,
            });
          }
        }

        if (entries.length === 0) {
          setParseError('कोई मान्य डेटा नहीं मिला। कृपया Excel फ़ाइल फ़ॉर्मैट जाँचें।');
        } else {
          setParsedData(entries);
        }
      } catch (error) {
        setParseError('फ़ाइल पढ़ने में त्रुटि। कृपया सही Excel फ़ाइल अपलोड करें।');
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.name.match(/\.(xlsx|xls)$/)) {
        setUploadedFile(file);
        parseExcelFile(file);
      } else {
        setParseError('केवल Excel फ़ाइलें (.xlsx, .xls) स्वीकार्य हैं।');
      }
    }
  }, [parseExcelFile]);

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

  const removeEntry = (id) => {
    setParsedData(prev => prev.filter(entry => entry.id !== id));
  };

  // Manual Submit - Confirmed
  const handleConfirmedSubmit = async (data) => {
    try {
      await createCommitteeMemberMutation.mutateAsync(data);
      const typeLabel = data.type === 'committee-production' ? 'समिति-उपार्जन केंद्र' : 'संग्रहण केंद्र';
      toast.success('Committee Procurement Added Successfully', {
        description: `${data.committeeName} (${typeLabel}) has been added to the system.`,
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to add committee', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Bulk Submit - Confirmed
  const handleConfirmedBulkSubmit = async () => {
    const validEntries = parsedData.filter(entry => entry.isValid);
    try {
      await createBulkCommitteeMembersMutation.mutateAsync(validEntries);
      toast.success(`${validEntries.length} समिति/संग्रहण केंद्र सफलतापूर्वक जोड़े गए`);
      clearFile();
    } catch (error) {
      toast.error('बल्क अपलोड में त्रुटि', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Hooks for confirmation dialog
  const manualConfirm = useConfirmDialog('committee-manual', handleConfirmedSubmit);
  const bulkConfirm = useConfirmDialog('committee-bulk', handleConfirmedBulkSubmit);

  const onSubmit = async (data) => {
    manualConfirm.openDialog(data);
  };

  const handleBulkSubmit = async () => {
    const validEntries = parsedData.filter(entry => entry.isValid);
    if (validEntries.length === 0) return;
    bulkConfirm.openDialog(null);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.committee.title')}</CardTitle>
        <CardDescription>
          {t('forms.committee.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-auto p-1">
            <TabsTrigger value="upload" className="py-2">
              <Upload className="w-4 h-4 mr-2" />
              Excel Upload
            </TabsTrigger>
            <TabsTrigger value="manual" className="py-2">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Manual Entry
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
                onClick={() => document.getElementById('committee-excel-input').click()}
              >
                <input
                  id="committee-excel-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">फ़ाइल यहाँ ड्रॉप करें</h3>
                <p className="text-slate-500 mb-4">या ब्राउज़ करने के लिए क्लिक करें</p>
                <p className="text-xs text-slate-400 font-medium bg-slate-100 inline-block px-3 py-1 rounded-full">
                  Format: Column A = प्रकार, Column B = नाम (.xlsx, .xls)
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
                    हटाएं
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
                      <h3 className="font-semibold text-slate-700">डेटा प्रीव्यू</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded border shadow-sm">
                        कुल: {parsedData.length} entries
                      </span>
                    </div>
                    <div className="max-h-[400px] overflow-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10">
                          <tr>
                            <th className="p-3 font-medium">प्रकार</th>
                            <th className="p-3 font-medium">नाम</th>
                            <th className="p-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {parsedData.map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/50">
                              <td className="p-3">
                                <span className={cn(
                                  'px-2 py-1 rounded text-xs font-medium',
                                  entry.type === 'committee-production'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-green-100 text-green-700'
                                )}>
                                  {entry.typeDisplay}
                                </span>
                              </td>
                              <td className="p-3 font-medium">{entry.committeeName}</td>
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
                      <Button
                        onClick={handleBulkSubmit}
                        disabled={createBulkCommitteeMembersMutation?.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {createBulkCommitteeMembersMutation?.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `${parsedData.length} entries जोड़ें`
                        )}
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Type Selection - Radio Buttons */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms.committee.type')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex items-center gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="committee-production" id="committee-production" />
                            <Label htmlFor="committee-production" className="font-normal cursor-pointer">
                              {t('forms.committee.types.center')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="storage" id="storage" />
                            <Label htmlFor="storage" className="font-normal cursor-pointer">
                              {t('forms.committee.types.storage')}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name Input */}
                <FormField
                  control={form.control}
                  name="committeeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms.committee.name')}</FormLabel>
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

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-full md:w-auto px-8"
                    disabled={createCommitteeMemberMutation.isPending}
                  >
                    {createCommitteeMemberMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('forms.common.saving')}
                      </>
                    ) : (
                      t('forms.common.submit')
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
            <AlertDialogTitle>{t('forms.common.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('forms.common.confirmMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('forms.common.confirmNo')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={manualConfirm.handleConfirm}>
              {t('forms.common.confirmYes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Confirmation Dialog */}
      <AlertDialog open={bulkConfirm.isOpen} onOpenChange={bulkConfirm.closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('forms.common.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              क्या आप {parsedData.length} समिति/संग्रहण केंद्र जोड़ना चाहते हैं?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('forms.common.confirmNo')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={bulkConfirm.handleConfirm}>
              {t('forms.common.confirmYes')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
