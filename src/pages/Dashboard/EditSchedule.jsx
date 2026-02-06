import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import scheduleService from '@/services/scheduleService';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react';

const SLOT_TYPES = ['lecture', 'lab', 'break', 'exam'];

const emptySlot = (slotNumber) => ({
  slotNumber,
  timeRange: '',
  course: '',
  courseTitle: '',
  room: '',
  teacher: '',
  teacherName: '',
  type: 'lecture',
});

const EditSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('');
  const [section, setSection] = useState('');
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  const { data: scheduleData, isLoading, error } = useQuery({
    queryKey: ['schedule', id],
    queryFn: () => scheduleService.getScheduleById(id),
    enabled: !!id,
  });

  const schedule = scheduleData?.data;

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title || '');
      setSemester(schedule.semester || '');
      setSection(schedule.section || '');
      setWeeklySchedule(
        JSON.parse(
          JSON.stringify(schedule.weeklySchedule || [])
        )
      );
    }
  }, [schedule]);

  const updateMutation = useMutation({
    mutationFn: (data) => scheduleService.updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['mySchedule']);
      queryClient.invalidateQueries(['schedule', id]);
      toast.success('Schedule updated successfully');
      navigate('/dashboard/schedule');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update schedule');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!id) return;
    updateMutation.mutate({
      title: title.trim(),
      semester: semester.trim(),
      section: section.trim(),
      weeklySchedule,
    });
  };

  const updateDaySlots = (dayIndex, newSlots) => {
    const renumbered = newSlots.map((s, i) => ({ ...s, slotNumber: i + 1 }));
    setWeeklySchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, slots: renumbered } : day
      )
    );
  };

  const updateSlot = (dayIndex, slotIndex, field, value) => {
    setWeeklySchedule((prev) =>
      prev.map((day, i) => {
        if (i !== dayIndex) return day;
        const slots = day.slots.map((slot, j) =>
          j === slotIndex ? { ...slot, [field]: value } : slot
        );
        return { ...day, slots };
      })
    );
  };

  const addSlot = (dayIndex) => {
    const day = weeklySchedule[dayIndex];
    const nextNum = (day.slots?.length || 0) + 1;
    const newSlot = emptySlot(nextNum);
    setWeeklySchedule((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? { ...d, slots: [...(d.slots || []), newSlot] }
          : d
      )
    );
  };

  const removeSlot = (dayIndex, slotIndex) => {
    const day = weeklySchedule[dayIndex];
    const newSlots = day.slots.filter((_, j) => j !== slotIndex);
    updateDaySlots(dayIndex, newSlots);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#04642a] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Schedule not found or you don&apos;t have access.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/schedule')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#04642a] text-white hover:bg-[#035a24] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schedule
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/schedule')}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Schedule
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Schedule
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1 – Metadata */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Schedule details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:border-transparent"
                  placeholder="My Schedule"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:border-transparent"
                  placeholder="e.g. Fall 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Section
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#04642a] focus:border-transparent"
                  placeholder="e.g. A"
                />
              </div>
            </div>
          </div>

          {/* Section 2 – Weekly schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly schedule
            </h2>
            <div className="space-y-6">
              {weeklySchedule.map((day, dayIndex) => (
                <div
                  key={day.day}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {day.day}
                    </h3>
                    <button
                      type="button"
                      onClick={() => addSlot(dayIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-[#04642a] text-white hover:bg-[#035a24] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add slot
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(day.slots || []).map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600"
                      >
                        <input
                          type="text"
                          value={slot.timeRange || ''}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, 'timeRange', e.target.value)
                          }
                          placeholder="Time (e.g. 8:00 - 9:15)"
                          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#04642a]"
                        />
                        <input
                          type="text"
                          value={slot.course || ''}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, 'course', e.target.value)
                          }
                          placeholder="Course code"
                          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#04642a]"
                        />
                        <input
                          type="text"
                          value={slot.courseTitle || ''}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, 'courseTitle', e.target.value)
                          }
                          placeholder="Course title"
                          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#04642a]"
                        />
                        <input
                          type="text"
                          value={slot.room || ''}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, 'room', e.target.value)
                          }
                          placeholder="Room"
                          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#04642a]"
                        />
                        <input
                          type="text"
                          value={slot.teacher || ''}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, 'teacher', e.target.value)
                          }
                          placeholder="Teacher"
                          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#04642a]"
                        />
                        <input
                          type="text"
                          value={slot.teacherName || ''}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, 'teacherName', e.target.value)
                          }
                          placeholder="Teacher name"
                          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#04642a]"
                        />
                        <select
                          value={slot.type || 'lecture'}
                          onChange={(e) =>
                            updateSlot(dayIndex, slotIndex, 'type', e.target.value)
                          }
                          className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#04642a]"
                        >
                          {SLOT_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </option>
                          ))}
                        </select>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => removeSlot(dayIndex, slotIndex)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Remove slot"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {(day.slots?.length || 0) === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No slots. Click &quot;Add slot&quot; to add one.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/schedule')}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[#04642a] text-white font-medium hover:bg-[#035a24] disabled:opacity-50 transition-colors"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSchedule;
