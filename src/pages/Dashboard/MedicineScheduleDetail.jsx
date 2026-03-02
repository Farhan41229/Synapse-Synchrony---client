import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicineScheduleService } from '@/services/medicineScheduleService';
import toast from 'react-hot-toast';
import { confirmDelete } from '@/lib/swal';
import {
  ChevronLeft,
  Pill,
  Trash2,
  Loader2,
  Stethoscope,
  User,
  CalendarDays,
  Building2,
  Pencil,
  Check,
  X,
  Plus,
  Save,
} from 'lucide-react';
import { format } from 'date-fns';

const emptyMedicine = () => ({ name: '', dosage: '', duration: '', notes: '' });

const MedicineScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: res, isLoading, error } = useQuery({
    queryKey: ['medicine-schedule', id],
    queryFn: () => medicineScheduleService.getScheduleById(id),
  });

  const schedule = res?.data;

  // ── draft state ──────────────────────────────────────────────────────────
  const [draft, setDraft] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [editingMedIdx, setEditingMedIdx] = useState(null);
  const [medDraft, setMedDraft] = useState(null); // fields for the row being edited

  useEffect(() => {
    if (schedule) {
      setDraft({
        title: schedule.title || '',
        hospital: schedule.hospital || '',
        doctor: schedule.doctor || '',
        date: schedule.date || '',
        diagnosis: schedule.diagnosis || '',
        medicines: (schedule.medicines || []).map((m) => ({ ...m })),
      });
      setIsDirty(false);
      setEditingMedIdx(null);
    }
  }, [schedule]);

  const updateField = (field, value) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: value };
      setIsDirty(true);
      return next;
    });
  };

  // ── delete prescription ───────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: () => medicineScheduleService.deleteSchedule(id),
    onSuccess: () => {
      toast.success('Prescription deleted');
      queryClient.invalidateQueries({ queryKey: ['my-medicine-schedules'] });
      navigate('/dashboard/medicine');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete');
    },
  });

  const handleDelete = async () => {
    const result = await confirmDelete({ text: 'Delete this prescription? This cannot be undone.' });
    if (result.isConfirmed) deleteMutation.mutate();
  };

  // ── save changes ──────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: () => medicineScheduleService.updateSchedule(id, draft),
    onSuccess: () => {
      toast.success('Prescription saved');
      queryClient.invalidateQueries({ queryKey: ['medicine-schedule', id] });
      queryClient.invalidateQueries({ queryKey: ['my-medicine-schedules'] });
      setIsDirty(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save');
    },
  });

  // ── medicine row helpers ──────────────────────────────────────────────────
  const startEditMed = (idx) => {
    setEditingMedIdx(idx);
    setMedDraft({ ...draft.medicines[idx] });
  };

  const cancelEditMed = () => {
    // If it was a freshly added (blank) row, remove it
    if (draft.medicines[editingMedIdx]?.name === '' && medDraft?.name === '') {
      deleteMed(editingMedIdx);
    }
    setEditingMedIdx(null);
    setMedDraft(null);
  };

  const saveEditMed = () => {
    const updated = draft.medicines.map((m, i) => (i === editingMedIdx ? { ...medDraft } : m));
    setDraft((prev) => ({ ...prev, medicines: updated }));
    setIsDirty(true);
    setEditingMedIdx(null);
    setMedDraft(null);
  };

  const deleteMed = (idx) => {
    setDraft((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== idx),
    }));
    setIsDirty(true);
    if (editingMedIdx === idx) {
      setEditingMedIdx(null);
      setMedDraft(null);
    }
  };

  const addMedicine = () => {
    const newMeds = [...(draft.medicines || []), emptyMedicine()];
    setDraft((prev) => ({ ...prev, medicines: newMeds }));
    setEditingMedIdx(newMeds.length - 1);
    setMedDraft(emptyMedicine());
  };

  // ── loading / error ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !schedule || !draft) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center py-20">
          <Pill className="w-14 h-14 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Prescription not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This prescription may have been deleted or you don&apos;t have access.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/medicine')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Prescriptions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 pb-28">
      <div className="max-w-3xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard/medicine')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            My Prescriptions
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden">

          {/* Card header — editable title */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/60">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 shrink-0">
                <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Prescription title"
                className="flex-1 text-xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-transparent focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-300 dark:placeholder-gray-600"
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 ml-[52px]">
              Saved {schedule.createdAt ? format(new Date(schedule.createdAt), 'MMM dd, yyyy · h:mm a') : ''}
            </p>
          </div>

          {/* Meta info grid — editable */}
          <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-gray-100 dark:border-gray-700/60">
            {/* Hospital */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 mt-1.5">
                <Building2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Hospital / Clinic</p>
                <input
                  type="text"
                  value={draft.hospital}
                  onChange={(e) => updateField('hospital', e.target.value)}
                  placeholder="e.g. City General Hospital"
                  className="w-full text-sm text-gray-900 dark:text-white bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-300 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Doctor */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 mt-1.5">
                <User className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Doctor</p>
                <input
                  type="text"
                  value={draft.doctor}
                  onChange={(e) => updateField('doctor', e.target.value)}
                  placeholder="e.g. Dr. Smith"
                  className="w-full text-sm text-gray-900 dark:text-white bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-300 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 mt-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
                <input
                  type="text"
                  value={draft.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  placeholder="e.g. Jan 15, 2026"
                  className="w-full text-sm text-gray-900 dark:text-white bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none transition-colors placeholder-gray-300 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Diagnosis */}
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 mt-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Diagnosis</p>
                <textarea
                  value={draft.diagnosis}
                  onChange={(e) => updateField('diagnosis', e.target.value)}
                  placeholder="e.g. Viral fever"
                  rows={2}
                  className="w-full text-sm text-gray-900 dark:text-white bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none transition-colors resize-none placeholder-gray-300 dark:placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Medicines */}
          <div className="px-6 py-5">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Prescription — {draft.medicines?.length || 0} Medicine{draft.medicines?.length !== 1 ? 's' : ''}
            </h2>

            {draft.medicines?.length > 0 ? (
              <div className="space-y-3">
                {draft.medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-gray-200/80 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-800/50"
                  >
                    {editingMedIdx === idx ? (
                      /* ── inline edit mode ── */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Medicine name *</label>
                            <input
                              type="text"
                              value={medDraft.name}
                              onChange={(e) => setMedDraft((p) => ({ ...p, name: e.target.value }))}
                              placeholder="e.g. DOLO 650"
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Dosage</label>
                            <input
                              type="text"
                              value={medDraft.dosage}
                              onChange={(e) => setMedDraft((p) => ({ ...p, dosage: e.target.value }))}
                              placeholder="e.g. 0-0-1 After Food"
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Duration</label>
                            <input
                              type="text"
                              value={medDraft.duration}
                              onChange={(e) => setMedDraft((p) => ({ ...p, duration: e.target.value }))}
                              placeholder="e.g. 3 Days"
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                            <input
                              type="text"
                              value={medDraft.notes}
                              onChange={(e) => setMedDraft((p) => ({ ...p, notes: e.target.value }))}
                              placeholder="e.g. Take with warm water"
                              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={saveEditMed}
                            disabled={!medDraft.name.trim()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Save row
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditMed}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── display mode ── */
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            {med.name || <span className="text-gray-400 italic">Unnamed medicine</span>}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {med.dosage && (
                              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                {med.dosage}
                              </span>
                            )}
                            {med.duration && (
                              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                {med.duration}
                              </span>
                            )}
                            {med.notes && (
                              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                {med.notes}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Edit / Delete buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditMed(idx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="Edit medicine"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMed(idx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Pill className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No medicines recorded. Add one below.</p>
              </div>
            )}

            {/* Add medicine button */}
            <button
              type="button"
              onClick={addMedicine}
              disabled={editingMedIdx !== null}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Save Changes bar */}
      {isDirty && (
        <div className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 pointer-events-none">
          <div className="max-w-3xl mx-auto pointer-events-auto">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-4 flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">You have unsaved changes.</p>
              <button
                type="button"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors disabled:opacity-60 shrink-0"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineScheduleDetail;
