import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineScheduleService } from '@/services/medicineScheduleService';
import toast from 'react-hot-toast';
import { confirmDelete } from '@/lib/swal';
import {
  Pill,
  ScanLine,
  Search,
  Trash2,
  ChevronRight,
  Stethoscope,
  User,
  CalendarDays,
  ChevronLeft,
  LayoutGrid,
  Calendar,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';

// ── calendar helpers ──────────────────────────────────────────────────────────

const COLOR_PALETTE = [
  { bg: 'bg-blue-500',    light: 'bg-blue-100 dark:bg-blue-900/40',    text: 'text-blue-700 dark:text-blue-300',    dot: 'bg-blue-500'    },
  { bg: 'bg-violet-500',  light: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500'  },
  { bg: 'bg-emerald-500', light: 'bg-emerald-100 dark:bg-emerald-900/40',text: 'text-emerald-700 dark:text-emerald-300',dot: 'bg-emerald-500'},
  { bg: 'bg-rose-500',    light: 'bg-rose-100 dark:bg-rose-900/40',     text: 'text-rose-700 dark:text-rose-300',     dot: 'bg-rose-500'    },
  { bg: 'bg-amber-500',   light: 'bg-amber-100 dark:bg-amber-900/40',   text: 'text-amber-700 dark:text-amber-300',   dot: 'bg-amber-500'   },
  { bg: 'bg-teal-500',    light: 'bg-teal-100 dark:bg-teal-900/40',     text: 'text-teal-700 dark:text-teal-300',     dot: 'bg-teal-500'    },
];

const parseDays = (durationStr) => {
  if (!durationStr) return 1;
  const match = durationStr.match(/(\d+)\s*day/i);
  return match ? parseInt(match[1], 10) : 1;
};

const dateKey = (d) => format(d, 'yyyy-MM-dd');

const buildDateMap = (schedules) => {
  // { 'yyyy-MM-dd': [{ medicineName, dosage, duration, prescriptionId, prescriptionTitle, color }] }
  const map = {};
  schedules.forEach((schedule, schedIdx) => {
    const color = COLOR_PALETTE[schedIdx % COLOR_PALETTE.length];
    const start = new Date(schedule.createdAt);
    start.setHours(0, 0, 0, 0);

    (schedule.medicines || []).forEach((med) => {
      const days = parseDays(med.duration);
      for (let d = 0; d < days; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + d);
        const key = dateKey(day);
        if (!map[key]) map[key] = [];
        map[key].push({
          medicineName: med.name,
          dosage: med.dosage,
          duration: med.duration,
          prescriptionId: schedule._id,
          prescriptionTitle: schedule.title,
          hospital: schedule.hospital,
          diagnosis: schedule.diagnosis,
          color,
        });
      }
    });
  });
  return map;
};

// ── Calendar component ────────────────────────────────────────────────────────

const CalendarView = ({ schedules, onNavigate }) => {
  const [calMonth, setCalMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const dateMap = useMemo(() => buildDateMap(schedules), [schedules]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(calMonth);
    const monthEnd = endOfMonth(calMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Mon
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [calMonth]);

  const selectedItems = selectedDay ? (dateMap[selectedDay] || []) : [];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 px-5 py-3">
        <button
          type="button"
          onClick={() => { setCalMonth((m) => subMonths(m, 1)); setSelectedDay(null); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          {format(calMonth, 'MMMM yyyy')}
        </h2>
        <button
          type="button"
          onClick={() => { setCalMonth((m) => addMonths(m, 1)); setSelectedDay(null); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700/60">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = dateKey(day);
            const items = dateMap[key] || [];
            const isCurrentMonth = isSameMonth(day, calMonth);
            const isTodayDay = isToday(day);
            const isSelected = selectedDay === key;

            // Deduplicate dots by color for visual cleanliness
            const uniqueColors = [...new Map(items.map((it) => [it.color.dot, it.color])).values()];

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(isSelected ? null : key)}
                className={[
                  'relative min-h-[72px] p-2 text-left border-b border-r border-gray-100 dark:border-gray-700/40 transition-colors focus:outline-none',
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/30',
                  !isCurrentMonth && 'opacity-30',
                ].filter(Boolean).join(' ')}
              >
                {/* Date number */}
                <span
                  className={[
                    'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-1',
                    isTodayDay
                      ? 'bg-blue-600 text-white'
                      : isSelected
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-300',
                  ].join(' ')}
                >
                  {format(day, 'd')}
                </span>

                {/* Medicine dots */}
                {uniqueColors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {uniqueColors.slice(0, 3).map((color, ci) => (
                      <span key={ci} className={`w-2 h-2 rounded-full ${color.dot} shrink-0`} />
                    ))}
                    {uniqueColors.length > 3 && (
                      <span className="text-[10px] text-gray-400 leading-none self-center">
                        +{uniqueColors.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day panel */}
      {selectedDay && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {format(new Date(selectedDay + 'T00:00:00'), 'MMMM d, yyyy')}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedItems.length === 0 ? 'No medicines scheduled' : `${selectedItems.length} medicine${selectedItems.length !== 1 ? 's' : ''} scheduled`}
            </p>
          </div>

          {selectedItems.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-400">No medicines for this day.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {selectedItems.map((item, i) => (
                <div key={i} className="px-5 py-3.5 flex items-start gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color.dot} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.medicineName}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                      {item.dosage && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.dosage}</span>
                      )}
                      {item.duration && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.duration}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate(`/dashboard/medicine/${item.prescriptionId}`)}
                      className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate max-w-full text-left"
                    >
                      {item.prescriptionTitle}
                      {item.hospital ? ` · ${item.hospital}` : ''}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const MyMedicineSchedules = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('cards'); // 'cards' | 'calendar'

  const { data, isLoading } = useQuery({
    queryKey: ['my-medicine-schedules', search],
    queryFn: () => medicineScheduleService.getMySchedules(search),
    select: (res) => res.data || [],
  });

  // For calendar, always load all schedules (no search filter)
  const { data: allData } = useQuery({
    queryKey: ['my-medicine-schedules', ''],
    queryFn: () => medicineScheduleService.getMySchedules(''),
    select: (res) => res.data || [],
    enabled: view === 'calendar',
  });

  const deleteMutation = useMutation({
    mutationFn: medicineScheduleService.deleteSchedule,
    onSuccess: () => {
      toast.success('Prescription deleted');
      queryClient.invalidateQueries({ queryKey: ['my-medicine-schedules'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete prescription');
    },
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await confirmDelete({ text: 'Delete this prescription? This cannot be undone.' });
    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const schedules = data || [];
  const calendarSchedules = allData || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
              <Pill className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              My Prescriptions
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Extracted medicine schedules from your medical documents
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/medicine/extract')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
          >
            <ScanLine className="w-4 h-4" />
            Extract Prescription
          </button>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 mb-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setView('cards')}
            className={[
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
              view === 'cards'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            ].join(' ')}
          >
            <LayoutGrid className="w-4 h-4" />
            Cards
          </button>
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={[
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
              view === 'calendar'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
            ].join(' ')}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
        </div>

        {/* Search — only in cards view */}
        {view === 'cards' && (
          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {/* Content */}
        {view === 'calendar' ? (
          <CalendarView schedules={calendarSchedules} onNavigate={navigate} />
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 animate-pulse"
              />
            ))}
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <Pill className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {search ? 'No prescriptions found' : 'No prescriptions yet'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              {search
                ? 'Try a different search term.'
                : 'Upload a prescription or case sheet to extract your medicine schedule.'}
            </p>
            {!search && (
              <button
                type="button"
                onClick={() => navigate('/dashboard/medicine/extract')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm"
              >
                <ScanLine className="w-4 h-4" />
                Extract your first prescription
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schedules.map((schedule) => (
              <button
                key={schedule._id}
                type="button"
                onClick={() => navigate(`/dashboard/medicine/${schedule._id}`)}
                className="group text-left bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {/* Title + delete */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 shrink-0">
                      <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate text-sm">
                      {schedule.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, schedule._id)}
                    disabled={deleteMutation.isPending}
                    className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete prescription"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Meta info */}
                <div className="space-y-1.5 mb-3">
                  {schedule.diagnosis && (
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {schedule.diagnosis}
                      </span>
                    </div>
                  )}
                  {schedule.doctor && (
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {schedule.doctor}
                      </span>
                    </div>
                  )}
                  {schedule.date && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{schedule.date}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/60">
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {schedule.medicines?.length || 0} medicine{schedule.medicines?.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>
                      {schedule.createdAt ? format(new Date(schedule.createdAt), 'MMM dd, yyyy') : ''}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMedicineSchedules;
