import React, { useMemo, useCallback, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { useCreatePaddySale, useUpdatePaddySale } from "@/hooks/usePaddySales";
import { useAllParties } from "@/hooks/useParties";
import { useAllBrokers } from "@/hooks/useBrokers";
import { useAllCommittees } from "@/hooks/useCommittee";
import {
  paddyTypeOptions,
  salesTypeOptions,
  deliveryOptions,
  gunnyOptions,
} from "@/lib/constants";
import { useAllDOEntries } from "@/hooks/useDOEntries";
import { fetchDOEntryByNumber } from "@/api/doEntriesApi";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate, useLocation } from "react-router-dom";

// Form validation schema
const paddySalesFormSchema = z.object({
  date: z.date({
    required_error: "Date is required.",
  }),
  partyName: z
    .string()
    .min(1, {
      message: "Please select a party.",
    })
    .optional(),
  brokerName: z
    .string()
    .min(1, {
      message: "Please select a broker.",
    })
    .optional(),
  salesType: z
    .enum([salesTypeOptions[0].value, salesTypeOptions[1].value], {
      required_error: "Please select sales type.",
    })
    .optional(),
  quantity: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  delivery: z
    .enum([deliveryOptions[0].value, deliveryOptions[1].value], {
      required_error: "Please select delivery option.",
    })
    .optional(),
  doEntries: z
    .array(
      z.object({
        doNumber: z.string().optional(),
        dhanMota: z
          .string()
          .regex(/^\d*\.?\d*$/, {
            message: "Must be a valid number.",
          })
          .optional(),
        dhanPatla: z
          .string()
          .regex(/^\d*\.?\d*$/, {
            message: "Must be a valid number.",
          })
          .optional(),
        dhanSarna: z
          .string()
          .regex(/^\d*\.?\d*$/, {
            message: "Must be a valid number.",
          })
          .optional(),
      })
    )
    .optional(),
  paddyType: z.string().optional(),
  paddyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  batavPercent: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  brokerage: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  gunnyOption: z
    .enum(
      [gunnyOptions[0].value, gunnyOptions[1].value, gunnyOptions[2].value],
      {
        required_error: "Please select packaging option.",
      }
    )
    .optional(),
  newGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  oldGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
  plasticGunnyRate: z
    .string()
    .regex(/^\d*\.?\d*$/, {
      message: "Must be a valid number.",
    })
    .optional(),
});

export default function AddPaddySalesForm() {
  const { t } = useTranslation(["forms", "entry", "common"]);
  const navigate = useNavigate();
  const location = useLocation();
  const createPaddySale = useCreatePaddySale();
  const updatePaddySale = useUpdatePaddySale();

  // Check if editing mode
  const editData = location.state?.deal;
  const isEditMode = location.state?.isEditing && editData;

  // Fetch parties, brokers, and committees from server
  const { parties, isLoading: partiesLoading } = useAllParties();
  const { brokers, isLoading: brokersLoading } = useAllBrokers();
  const { committees, isLoading: committeesLoading } = useAllCommittees();
  const { doEntries: allDOs } = useAllDOEntries();

  // Convert to options format for SearchableSelect
  const partyOptions = useMemo(
    () =>
      parties.map((party) => ({
        value: party.partyName,
        label: party.partyName,
      })),
    [parties]
  );

  const brokerOptions = useMemo(
    () =>
      brokers.map((broker) => ({
        value: broker.brokerName,
        label: broker.brokerName,
      })),
    [brokers]
  );

  const committeeOptions = useMemo(
    () =>
      committees.map((committee) => ({
        value: committee.committeeName,
        label: committee.committeeName,
      })),
    [committees]
  );

  const doOptions = useMemo(
    () =>
      allDOs.map((doEntry) => ({
        value: doEntry.doNumber,
        label: doEntry.doNumber,
      })),
    [allDOs]
  );

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(paddySalesFormSchema),
    defaultValues: {
      date: new Date(),
      partyName: "",
      brokerName: "",
      salesType: "",
      quantity: "",
      delivery: "",
      doEntries: [{ doNumber: "", dhanMota: "", dhanPatla: "", dhanSarna: "" }],
      paddyType: "",
      paddyRate: "",
      batavPercent: "",
      brokerage: "",
      gunnyOption: "",
      newGunnyRate: "",
      oldGunnyRate: "",
      plasticGunnyRate: "",
    },
  });

  // useFieldArray for multiple DO entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "doEntries",
  });

  // Watch salesType to conditionally show DO entries
  const salesType = form.watch("salesType");

  // Watch gunnyOption to conditionally show packaging rate fields
  const gunnyOption = form.watch("gunnyOption");

  // Watch doEntries to calculate total DO quantities
  const doEntries = useWatch({
    control: form.control,
    name: "doEntries",
    defaultValue: fields,
  });

  const [debouncedDoEntries] = useDebounce(doEntries, 300);

  // Auto-calculate quantity from DO entries when salesType is 'DO Sales'
  useEffect(() => {
    if (
      salesType === salesTypeOptions[0].value &&
      debouncedDoEntries &&
      debouncedDoEntries.length > 0
    ) {
      const total = debouncedDoEntries.reduce((sum, entry) => {
        const mota = parseFloat(entry?.dhanMota || 0);
        const patla = parseFloat(entry?.dhanPatla || 0);
        const sarna = parseFloat(entry?.dhanSarna || 0);
        return sum + mota + patla + sarna;
      }, 0);
      form.setValue("quantity", total > 0 ? total.toString() : "");
    }
  }, [salesType, debouncedDoEntries, form]);

  // Clear quantity when switching from DO sales to other sales (but not in edit mode on load)
  useEffect(() => {
    // Don't clear if we're in edit mode and just loading the data
    if (salesType === salesTypeOptions[1].value && !isEditMode) {
      form.setValue("quantity", "");
    }
  }, [salesType, form, isEditMode]);

  // Handler to fetch DO details and auto-fill grain fields
  const handleDOChange = useCallback(
    async (doNumber, index, fieldOnChange) => {
      fieldOnChange(doNumber); // Update the field value first

      if (!doNumber) {
        form.setValue(`doEntries.${index}.dhanMota`, "0");
        form.setValue(`doEntries.${index}.dhanPatla`, "0");
        form.setValue(`doEntries.${index}.dhanSarna`, "0");
        return;
      }

      try {
        const response = await fetchDOEntryByNumber(doNumber);
        if (response?.data) {
          const { grainMota, grainPatla, grainSarna, remainingDO } =
            response.data;

          // Use remaining quantity if available, otherwise total quantity
          form.setValue(
            `doEntries.${index}.dhanMota`,
            remainingDO?.grainMota || grainMota || ""
          );
          form.setValue(
            `doEntries.${index}.dhanPatla`,
            remainingDO?.grainPatla || grainPatla || ""
          );
          form.setValue(
            `doEntries.${index}.dhanSarna`,
            remainingDO?.grainSarna || grainSarna || ""
          );
        }
      } catch (error) {
        console.error("Error fetching DO details:", error);
      }
    },
    [form]
  );

  // Auto-fill form when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
      form.reset({
        date: editData.date ? new Date(editData.date) : new Date(),
        partyName: editData.partyName || "",
        brokerName: editData.brokerName || "",
        salesType: editData.salesType || "",
        quantity: editData.quantity || "",
        delivery: editData.delivery || "",
        doEntries:
          editData.doEntries && editData.doEntries.length > 0
            ? editData.doEntries
            : [{ doNumber: "", dhanMota: "", dhanPatla: "", dhanSarna: "" }],
        paddyType: editData.paddyType || "",
        paddyRate: editData.paddyRate || "",
        batavPercent: editData.batavPercent || "",
        brokerage: editData.brokerage || "",
        gunnyOption: editData.gunnyOption || "",
        newGunnyRate: editData.newGunnyRate || "",
        oldGunnyRate: editData.oldGunnyRate || "",
        plasticGunnyRate: editData.plasticGunnyRate || "",
      });
    }
  }, [isEditMode, editData, form]);

  // Form submission handler - actual submission after confirmation
  const handleConfirmedSubmit = (data) => {
    const formattedData = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    if (isEditMode) {
      updatePaddySale.mutate(
        { id: editData._id, ...formattedData },
        {
          onSuccess: () => {
            toast.success("Paddy Sales Updated Successfully", {
              description: `Sales for ${data.partyName} has been updated.`,
            });
            form.reset();
            navigate(-1);
          },
          onError: (error) => {
            toast.error("Error updating Paddy Sales", {
              description: error.message,
            });
          },
        }
      );
    } else {
      createPaddySale.mutate(formattedData, {
        onSuccess: () => {
          toast.success("Paddy Sales Added Successfully", {
            description: `Sales for ${data.partyName} has been recorded.`,
          });
          form.reset();
        },
        onError: (error) => {
          toast.error("Error creating Paddy Sales", {
            description: error.message,
          });
        },
      });
    }
  };

  // Hook for confirmation dialog
  const { isOpen, openDialog, closeDialog, handleConfirm } = useConfirmDialog(
    "paddy-sales",
    handleConfirmedSubmit
  );

  // Form submission handler - shows confirmation dialog first
  const onSubmit = async (data) => {
    openDialog(data);
  };

  // Error handler for form validation
  const onInvalid = (errors) => {
    const errorFields = Object.keys(errors)
      .map((key) => t(`forms.paddySales.${key}`) || key)
      .join(", ");
    toast.error(t("forms.common.validationError"), {
      description: `Missing or invalid fields: ${errorFields}`,
    });
    console.error("Form Validation Errors:", errors);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        {isEditMode && (
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
        <CardTitle>
          {isEditMode
            ? "धान बिक्री सौदा संपादित करें"
            : t("forms.paddySales.title")}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Edit Paddy Sales Deal"
            : t("forms.paddySales.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            {/* Date with Calendar */}
            <DatePickerField name="date" label={t("forms.common.date")} />

            {/* Party Name Dropdown */}
            <FormField
              control={form.control}
              name="partyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddySales.partyName")}
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={partyOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Broker Name Dropdown */}
            <FormField
              control={form.control}
              name="brokerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddySales.brokerName")}
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={brokerOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sales Type Radio Buttons */}
            <FormField
              control={form.control}
              name="salesType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddySales.salesType")}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      {salesTypeOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`sales-${option.value}`}
                          />
                          <Label
                            htmlFor={`sales-${option.value}`}
                            className="font-normal cursor-pointer"
                          >
                            {option.labelHi}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* मात्रा (Quantity in Quintals) */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    मात्रा (क्विटल में.)
                    {salesType === salesTypeOptions[0].value && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (DO की कुल मात्रा)
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className={`placeholder:text-gray-400 ${
                        salesType === salesTypeOptions[0].value
                          ? "bg-muted cursor-not-allowed"
                          : ""
                      }`}
                      readOnly={salesType === salesTypeOptions[0].value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* डिलीवरी (Delivery) Radio Buttons */}
            <FormField
              control={form.control}
              name="delivery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">डिलीवरी</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      {deliveryOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`delivery-${option.value}`}
                          />
                          <Label
                            htmlFor={`delivery-${option.value}`}
                            className="font-normal cursor-pointer"
                          >
                            {option.labelHi}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DO Entries - Only show for DO बिक्री */}
            {salesType === salesTypeOptions[0].value && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-base font-semibold">
                    DO प्रविष्ट करें
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        doNumber: "",
                        dhanMota: "0",
                        dhanPatla: "0",
                        dhanSarna: "0",
                      })
                    }
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    DO जोड़ें
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-3 p-3 border rounded-md bg-background"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        DO Entry #{index + 1}
                      </span>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* DO Number */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.doNumber`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DO क्रमांक</FormLabel>
                            <FormControl>
                              <SearchableSelect
                                options={doOptions}
                                value={field.value}
                                onChange={(value) =>
                                  handleDOChange(value, index, field.onChange)
                                }
                                placeholder="Select DO"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* धान (मोटा) */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.dhanMota`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>धान (मोटा)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...field}
                                // readOnly
                                className="bg-muted"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* धान (पतला) */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.dhanPatla`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>धान (पतला)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...field}
                                // readOnly
                                className="bg-muted"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* धान (सरना) */}
                      <FormField
                        control={form.control}
                        name={`doEntries.${index}.dhanSarna`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>धान (सरना)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...field}
                                // readOnly
                                className="bg-muted"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paddy Type Dropdown */}
            <FormField
              control={form.control}
              name="paddyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    {t("forms.paddySales.paddyType")}
                  </FormLabel>
                  <FormControl>
                    <SearchableSelect
                      options={paddyTypeOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* धान का भाव/दर (Paddy Rate) */}
            <FormField
              control={form.control}
              name="paddyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    धान का भाव/दर (प्रति क्विटल)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* बटाव % (batav Percent) */}
            <FormField
              control={form.control}
              name="batavPercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">बटाव %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* दलाली (Brokerage) */}
            <FormField
              control={form.control}
              name="brokerage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    दलाली (प्रति क्विटल)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      className="placeholder:text-gray-400"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* बारदाना सहित/वापसी (Packaging) Radio Buttons */}
            <FormField
              control={form.control}
              name="gunnyOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    बारदाना सहित/वापसी
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex items-center gap-6"
                    >
                      {gunnyOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`gunny-${option.value}`}
                          />
                          <Label
                            htmlFor={`gunny-${option.value}`}
                            className="font-normal cursor-pointer"
                          >
                            {option.labelHi}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Packaging Rate Fields - Only show when packaging === 'with-quantity' */}
            {gunnyOption === gunnyOptions[1].value && (
              <>
                {/* नया बारदाना दर (New Packaging Rate) */}
                <FormField
                  control={form.control}
                  name="newGunnyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        नया बारदाना दर
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          {...field}
                          className="placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* पुराना बारदाना दर (Old Packaging Rate) */}
                <FormField
                  control={form.control}
                  name="oldGunnyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        पुराना बारदाना दर
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          {...field}
                          className="placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* प्लास्टिक बारदाना दर (Plastic Packaging Rate) */}
                <FormField
                  control={form.control}
                  name="plasticGunnyRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        प्लास्टिक बारदाना दर
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          {...field}
                          className="placeholder:text-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={
                  createPaddySale.isPending || updatePaddySale.isPending
                }
              >
                {createPaddySale.isPending || updatePaddySale.isPending
                  ? t("forms.common.saving")
                  : isEditMode
                  ? "Update"
                  : t("forms.common.submit")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={isOpen} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("forms.common.confirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("forms.common.confirmMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>
              {t("forms.common.confirmNo")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {t("forms.common.confirmYes")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
