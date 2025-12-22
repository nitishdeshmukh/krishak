import React, { useState, useCallback } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { DatePickerField } from '@/components/ui/date-picker-field';
import { useCreateDOEntry, useCreateBulkDOEntries } from '@/hooks/useDOEntries';
import { Upload, FileSpreadsheet, X, Check, AlertCircle } from 'lucide-react';

// Form validation schema for manual entry
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
  grainMota: z.string().regex(/^\d*$/, {
    message: 'Must be a valid number.',
  }),
  grainPatla: z.string().regex(/^\d*$/, {
    message: 'Must be a valid number.',
  }),
  grainSarna: z.string().regex(/^\d*$/, {
    message: 'Must be a valid number.',
  }),
  total: z.string().regex(/^\d*$/, {
    message: 'Must be a valid number.',
  }),
});

export default function DOEntryForm() {
  const { t } = useTranslation(['forms', 'entry', 'common']);
  const createDOEntryMutation = useCreateDOEntry();
  const createBulkDOEntriesMutation = useCreateBulkDOEntries();

  // Mode toggle: 'manual' or 'upload'
  const [mode, setMode] = useState('manual');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sample committee/storage centers - Replace with actual data from API
  const committeeCenters = [
    'हिरी - हिरी',
    'डोड़की - डोड़की',
    'नगपूरा - नगपूरा',
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
      date: new Date(),
      grainMota: '0',
      grainPatla: '0',
      grainSarna: '0',
      total: '0',
    },
  });

  // Watch grain fields for auto-calculation
  const watchedFields = form.watch(['grainMota', 'grainPatla', 'grainSarna']);

  React.useEffect(() => {
    const [mota, patla, sarna] = watchedFields;
    const total = (parseInt(mota) || 0) + (parseInt(patla) || 0) + (parseInt(sarna) || 0);
    form.setValue('total', total.toString());
  }, [watchedFields, form]);

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

        // Skip header row and parse data
        // Skip header row and parse data
        const entries = [];
        let lastCommitteeCenter = '';

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];

          // Skip empty rows
          if (!row || row.length === 0) continue;

          // Handle merged cells for Committee Center (Column A)
          // If current row has specific committee center, update lastCommitteeCenter
          // Otherwise use the last seen committee center
          if (row[0]) {
            lastCommitteeCenter = row[0];
          }

          const currentCommitteeCenter = row[0] || lastCommitteeCenter;
          const doNumber = row[2];

          // Only valid if we have both Committee Center (or inherited one) and DO Number
          if (doNumber) {
            // Parse date from Excel format (DD-MM-YYYY)
            let dateValue = row[3];
            if (typeof dateValue === 'number') {
              // Excel date serial number
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
          setParseError('No valid data found in the file. Please check the format.');
        } else {
          setParsedData(entries);
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setParseError('Failed to parse Excel file. Please ensure it\'s a valid .xlsx or .xls file.');
      }
    };

    reader.onerror = () => {
      setParseError('Failed to read file.');
    };

    reader.readAsArrayBuffer(file);
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setUploadedFile(file);
        parseExcelFile(file);
      } else {
        setParseError('Please upload a valid Excel file (.xlsx or .xls)');
      }
    }
  }, [parseExcelFile]);

  // Handle file input change
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      parseExcelFile(file);
    }
  }, [parseExcelFile]);

  // Clear uploaded file
  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setParsedData([]);
    setParseError(null);
  }, []);

  // Manual form submission handler
  const onSubmit = async (data) => {
    try {
      const submitData = { ...data, date: format(data.date, 'yyyy-MM-dd') };
      await createDOEntryMutation.mutateAsync(submitData);
      toast.success('DO Entry Added Successfully', {
        description: `DO Number ${data.doNumber} has been added to the system.`,
      });
      form.reset();
    } catch (error) {
      toast.error('Failed to add DO entry', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Bulk upload submission handler
  const handleBulkSubmit = async () => {
    const validEntries = parsedData.filter(entry => entry.isValid);
    if (validEntries.length === 0) {
      toast.error('No valid entries to submit');
      return;
    }

    try {
      await createBulkDOEntriesMutation.mutateAsync(validEntries);
      toast.success(`${validEntries.length} DO Entries Added Successfully`);
      clearFile();
    } catch (error) {
      toast.error('Failed to add DO entries', {
        description: error.message || 'An error occurred.',
      });
    }
  };

  // Remove entry from parsed data
  const removeEntry = (id) => {
    setParsedData(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t('forms.doEntry.title')}</CardTitle>
        <CardDescription>
          {t('forms.doEntry.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            type="button"
            variant={mode === 'upload' ? 'default' : 'outline'}
            onClick={() => setMode('upload')}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Excel File
          </Button>
          <Button
            type="button"
            variant={mode === 'manual' ? 'default' : 'outline'}
            onClick={() => setMode('manual')}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Manual Entry
          </Button>
        </div>

        {/* Upload Mode */}
        {mode === 'upload' && (
          <div className="space-y-6">
            {/* File Drop Zone */}
            {!uploadedFile && (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                  ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}`}
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
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">Drop Excel file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: .xlsx, .xls
                </p>
              </div>
            )}

            {/* Uploaded File Info */}
            {uploadedFile && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Parse Error */}
            {parseError && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <p>{parseError}</p>
              </div>
            )}

            {/* Preview Table */}
            {parsedData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Preview ({parsedData.length} entries)
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {parsedData.filter(e => e.isValid).length} valid entries
                  </span>
                </div>

                <div className="border rounded-lg overflow-auto max-h-[400px]">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-3 text-left">समिती - उपार्जन केन्द्र</th>
                        <th className="p-3 text-left">डी.ओ.</th>
                        <th className="p-3 text-left">दिनांक</th>
                        <th className="p-3 text-right">मोटा</th>
                        <th className="p-3 text-right">पतला</th>
                        <th className="p-3 text-right">सरना</th>
                        <th className="p-3 text-right">कुल</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.map((entry) => (
                        <tr
                          key={entry.id}
                          className={`border-t ${!entry.isValid ? 'bg-destructive/5' : ''}`}
                        >
                          <td className="p-3">{entry.committeeCenter}</td>
                          <td className="p-3">{entry.doNumber}</td>
                          <td className="p-3">{entry.date}</td>
                          <td className="p-3 text-right">{entry.grainMota}</td>
                          <td className="p-3 text-right">{entry.grainPatla}</td>
                          <td className="p-3 text-right">{entry.grainSarna}</td>
                          <td className="p-3 text-right font-medium">{entry.total}</td>
                          <td className="p-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeEntry(entry.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={handleBulkSubmit}
                    disabled={createBulkDOEntriesMutation.isPending || parsedData.filter(e => e.isValid).length === 0}
                    className="px-8"
                  >
                    {createBulkDOEntriesMutation.isPending ? (
                      'Uploading...'
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Submit {parsedData.filter(e => e.isValid).length} Entries
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Mode */}
        {mode === 'manual' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DO Number */}
                <FormField
                  control={form.control}
                  name="doNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">{t('forms.doEntry.doNumber')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: DO-12345"
                          {...field}
                          className="font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date with Calendar */}
                <div className="pt-1">
                  <DatePickerField
                    name="date"
                    label={t('forms.doEntry.date')}
                  />
                </div>
              </div>

              {/* Committee/Storage Center Dropdown */}
              <FormField
                control={form.control}
                name="committeeCenter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">{t('forms.doEntry.committeeCenter')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {committeeCenters.map((center) => (
                          <SelectItem key={center} value={center}>
                            {center}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantities Section */}
              <div className="rounded-xl border bg-card/50 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h3 className="font-semibold text-lg">Quantity Details</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Grain Mota */}
                  <FormField
                    control={form.control}
                    name="grainMota"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-muted-foreground">मोटा</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            className="text-right font-medium"
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
                        <FormLabel className="text-muted-foreground">पतला</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            className="text-right font-medium"
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
                        <FormLabel className="text-muted-foreground">सरना</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            className="text-right font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Total (auto-calculated) */}
                  <FormField
                    control={form.control}
                    name="total"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold">कुल (Total)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            className="text-right font-bold bg-primary/5 border-primary/20"
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="w-full md:w-auto px-8 min-w-[200px]"
                  disabled={createDOEntryMutation.isPending}
                >
                  {createDOEntryMutation.isPending ? (
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
        )}
      </CardContent>
    </Card>
  );
}
