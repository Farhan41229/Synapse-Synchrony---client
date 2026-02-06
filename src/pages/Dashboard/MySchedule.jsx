import React from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import scheduleService from '@/services/scheduleService';
import toast from 'react-hot-toast';
import { Calendar, CalendarPlus, Loader2, Trash2, RefreshCw, Pencil } from 'lucide-react';

const MySchedule = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: scheduleData, isLoading, error, refetch } = useQuery({
    queryKey: ['mySchedule'],
    queryFn: scheduleService.getMySchedule,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: scheduleService.deleteSchedule,
    onSuccess: () => {
      toast.success('Schedule deleted successfully');
      queryClient.invalidateQueries(['mySchedule']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete schedule');
    },
  });

  const handleDelete = (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      deleteMutation.mutate(scheduleId);
    }
  };

  const schedule = scheduleData?.data;

  // Get all unique slot numbers across all days
  const getAllSlotNumbers = () => {
    if (!schedule?.weeklySchedule) return [];
    const slotNumbers = new Set();
    schedule.weeklySchedule.forEach(day => {
      day.slots.forEach(slot => {
        slotNumbers.add(slot.slotNumber);
      });
    });
    return Array.from(slotNumbers).sort((a, b) => a - b);
  };

  const slotNumbers = getAllSlotNumbers();

  // Get slot for a specific day and slot number
  const getSlot = (day, slotNumber) => {
    return day.slots.find(slot => slot.slotNumber === slotNumber);
  };

  // Generate a color based on course code
  const getCourseColor = (course) => {
    if (!course) return 'bg-gray-100 dark:bg-gray-700';
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
      'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
      'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700',
      'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
      'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
      'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700',
    ];
    const hash = course.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#04642a] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Schedule Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't uploaded a schedule yet. Upload one to get started!
            </p>
            <button
              onClick={() => navigate('/dashboard/schedule/upload')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#04642a] text-white font-medium hover:bg-[#035a24] transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              Upload Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-6 h-6 text-[#04642a]" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {schedule.title}
                </h1>
              </div>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                {schedule.semester && <span>Semester: {schedule.semester}</span>}
                {schedule.section && <span>Section: {schedule.section}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/schedule/${schedule._id}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Edit Schedule"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard/schedule/upload')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#04642a] text-white font-medium hover:bg-[#035a24] transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                Upload New
              </button>
              <button
                type="button"
                onClick={() => handleDelete(schedule._id)}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                title="Delete Schedule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white border-b border-r border-gray-200 dark:border-gray-700 min-w-[100px]">
                  Day
                </th>
                {slotNumbers.map(slotNum => (
                  <th
                    key={slotNum}
                    className="py-3 px-4 text-center text-sm font-semibold text-gray-900 dark:text-white border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-w-[150px]"
                  >
                    Slot {slotNum}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.weeklySchedule.map((day, dayIndex) => (
                <tr key={dayIndex} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white border-b border-r border-gray-200 dark:border-gray-700">
                    {day.day}
                  </td>
                  {slotNumbers.map(slotNum => {
                    const slot = getSlot(day, slotNum);
                    return (
                      <td
                        key={slotNum}
                        className="py-3 px-4 text-sm border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                      >
                        {slot ? (
                          <div className={`p-3 rounded-lg border ${slot.type === 'break' ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' : getCourseColor(slot.course)}`}>
                            {slot.type === 'break' ? (
                              <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
                                {slot.course || 'Break'}
                              </p>
                            ) : (
                              <>
                                <p className="font-bold text-gray-900 dark:text-white mb-1">
                                  {slot.course}
                                </p>
                                {slot.timeRange && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    {slot.timeRange}
                                  </p>
                                )}
                                {slot.room && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Room: {slot.room}
                                  </p>
                                )}
                                {slot.teacher && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {slot.teacher}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 text-center text-gray-400 dark:text-gray-600">
                            -
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Schedule Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Total Days:</span> {schedule.weeklySchedule.length}
            </div>
            <div>
              <span className="font-medium">Total Slots:</span>{' '}
              {schedule.weeklySchedule.reduce((sum, day) => sum + day.slots.length, 0)}
            </div>
            <div>
              <span className="font-medium">Extracted From:</span>{' '}
              {schedule.extractedFrom === 'image' ? 'Image' : 'Manual'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySchedule;
