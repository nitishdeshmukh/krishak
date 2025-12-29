import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStaff } from '@/hooks/useStaff';
import { useAttendanceByDate, useCreateBulkAttendance } from '@/hooks/useAttendance';
import { toast } from 'sonner';
import PageLoader from '../PageLoader';

export default function AddAttendanceForm() {
    const { t } = useTranslation(['common', 'forms']);
    const [date, setDate] = useState(new Date());
    const [attendanceMap, setAttendanceMap] = useState({});

    // Fetch Staff
    const { data: staffList, isLoading: isStaffLoading } = useStaff();

    // Fetch Existing Attendance
    const formattedDate = format(date, 'yyyy-MM-dd');
    const { data: existingData, isLoading: isAttendanceLoading, refetch: refetchAttendance } = useAttendanceByDate(formattedDate);

    // Save Mutation
    const { mutate: saveAttendance, isPending: isSaving } = useCreateBulkAttendance();

    // Initialize local state when data loads
    useEffect(() => {
        if (staffList) {
            const initialMap = {};
            // Default all to Present
            staffList.forEach(staff => {
                initialMap[staff._id] = 'Present';
            });

            // Override with existing
            if (existingData?.data) {
                existingData.data.forEach(record => {
                    const staffId = record.staff?._id || record.staff; // Handle populated vs unpopulated
                    if (staffId) {
                        initialMap[staffId] = record.status;
                    }
                });
            }
            setAttendanceMap(initialMap);
        }
    }, [staffList, existingData, date]); // Re-run when date changes (fetching new existing data)

    const handleStatusChange = (staffId, status) => {
        setAttendanceMap(prev => ({
            ...prev,
            [staffId]: status
        }));
    };

    const handleSubmit = () => {
        const records = Object.entries(attendanceMap).map(([staffId, status]) => ({
            staff: staffId,
            status
        }));

        saveAttendance(
            { date: formattedDate, records },
            {
                onSuccess: () => {
                    toast.success('Attendance saved successfully');
                    refetchAttendance();
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to save attendance');
                }
            }
        );
    };

    if (isStaffLoading) return <PageLoader />;

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{t('entry:sections.attendance.markAttendance') || 'Mark Attendance'}</span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-muted-foreground border-b pb-2">
                        <div className="col-span-4">Staff Name</div>
                        <div className="col-span-3">Post</div>
                        <div className="col-span-5 text-center">Status</div>
                    </div>

                    {/* Staff Rows */}
                    {staffList?.map((staff) => (
                        <div key={staff._id} className="grid grid-cols-12 gap-4 items-center py-2 border-b last:border-0">
                            <div className="col-span-4 font-medium">{staff.name}</div>
                            <div className="col-span-3 text-sm text-gray-500">{staff.post || '-'}</div>
                            <div className="col-span-5 flex justify-center gap-2">
                                <StatusButton
                                    label="P"
                                    fullLabel="Present"
                                    color="bg-green-100 text-green-700 hover:bg-green-200"
                                    activeColor="bg-green-600 text-white hover:bg-green-700"
                                    isActive={attendanceMap[staff._id] === 'Present'}
                                    onClick={() => handleStatusChange(staff._id, 'Present')}
                                />
                                <StatusButton
                                    label="A"
                                    fullLabel="Absent"
                                    color="bg-red-100 text-red-700 hover:bg-red-200"
                                    activeColor="bg-red-600 text-white hover:bg-red-700"
                                    isActive={attendanceMap[staff._id] === 'Absent'}
                                    onClick={() => handleStatusChange(staff._id, 'Absent')}
                                />
                                <StatusButton
                                    label="HD"
                                    fullLabel="Half Day"
                                    color="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                    activeColor="bg-yellow-500 text-white hover:bg-yellow-600"
                                    isActive={attendanceMap[staff._id] === 'Half Day'}
                                    onClick={() => handleStatusChange(staff._id, 'Half Day')}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="pt-6 flex justify-end">
                        <Button onClick={handleSubmit} disabled={isSaving || isAttendanceLoading}>
                            {isSaving ? 'Saving...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Attendance
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusButton({ label, fullLabel, color, activeColor, isActive, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={fullLabel}
            className={cn(
                "w-10 h-10 rounded-full font-bold text-xs transition-all flex items-center justify-center border",
                isActive ? activeColor : color,
                isActive ? "scale-110 shadow-md border-transparent" : "border-transparent opacity-80 hover:opacity-100"
            )}
        >
            {label}
        </button>
    );
}
