/**
 * @deprecated This page is no longer used as of the diagnosis system overhaul.
 * The AI no longer prescribes medications. Kept for reference only.
 * Do not import or route to this component in new code.
 */
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { diagnosisService } from '@/services/diagnosisService';
import {
  Pill,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  FileText,
  X,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const MyMedicationsPage = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMed, setSelectedMed] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  const {
    data: medicationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userMedications', filterStatus],
    queryFn: () =>
      diagnosisService.getUserMedications(
        filterStatus !== 'all' ? { status: filterStatus } : {}
      ),
  });

  const medications = medicationsData?.data?.medications || [];
  const stats = medicationsData?.data?.byStatus || {};

  // Update medication status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }) =>
      diagnosisService.updateMedicationStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries(['userMedications']);
      toast.success('Medication status updated');
      setSelectedMed(null);
      setNoteInput('');
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to update medication'
      );
    },
  });

  const handleStatusChange = (med, newStatus) => {
    updateStatusMutation.mutate({
      id: med._id,
      status: newStatus,
      notes: med.notes || '',
    });
  };

  const handleAddNote = (med) => {
    if (!noteInput.trim()) {
      toast.error('Please enter a note');
      return;
    }
    updateStatusMutation.mutate({
      id: med._id,
      status: med.status,
      notes: noteInput,
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'suggested':
        return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'taken':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'discontinued':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'suggested':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'taken':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'discontinued':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center" data-aos="fade-up">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Medications
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.response?.data?.message || 'Failed to load medications'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#04642a] to-[#15a33d] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto" data-aos="fade-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <Pill className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                My Medications
              </h1>
              <p className="text-white/90 mt-1">
                Track your suggested medications and health management
              </p>
            </div>
          </div>

          {/* Stats */}
          {!isLoading && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/70 text-sm">Suggested</p>
                <p className="text-2xl font-bold text-white">{stats.suggested || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/70 text-sm">Taken</p>
                <p className="text-2xl font-bold text-white">{stats.taken || 0}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white/70 text-sm">Discontinued</p>
                <p className="text-2xl font-bold text-white">
                  {stats.discontinued || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto" data-aos="fade-up">
          {['all', 'suggested', 'taken', 'discontinued'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-[#04642a] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#04642a]" />
            <span className="ml-3 text-gray-700 dark:text-gray-300">
              Loading medications...
            </span>
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center py-12" data-aos="fade-up">
            <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Medications Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start a diagnosis session to receive medication recommendations
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medications.map((med, index) => (
              <div
                key={med._id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-[#04642a] dark:hover:border-[#15a33d] transition-all"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {med.brandName || med.medicationName}
                      </h3>
                      {med.genericName && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {med.genericName}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        med.status
                      )}`}
                    >
                      {med.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {med.purpose && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Purpose
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {med.purpose}
                      </p>
                    </div>
                  )}

                  {med.prescribedFor && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                        Prescribed For
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {med.prescribedFor}
                      </p>
                    </div>
                  )}

                  {med.timestamp && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(med.timestamp), 'MMM dd, yyyy')}
                    </div>
                  )}

                  {med.notes && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        <strong>Note:</strong> {med.notes}
                      </p>
                    </div>
                  )}

                  {/* Status Change Buttons */}
                  <div className="flex gap-2">
                    {med.status !== 'taken' && (
                      <button
                        onClick={() => handleStatusChange(med, 'taken')}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-xs transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Taken
                      </button>
                    )}
                    {med.status !== 'discontinued' && (
                      <button
                        onClick={() => handleStatusChange(med, 'discontinued')}
                        disabled={updateStatusMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-xs transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-3 h-3" />
                        Stop
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedMed(med);
                        setNoteInput(med.notes || '');
                      }}
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-xs transition-all"
                    >
                      <FileText className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {selectedMed && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-2xl"
            data-aos="zoom-in"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Add Note
              </h3>
              <button
                onClick={() => {
                  setSelectedMed(null);
                  setNoteInput('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {selectedMed.brandName || selectedMed.medicationName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {selectedMed.purpose}
              </p>
            </div>

            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Add notes about this medication (e.g., side effects, effectiveness, etc.)"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:border-[#04642a] focus:outline-none transition-all resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedMed(null);
                  setNoteInput('');
                }}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddNote(selectedMed)}
                disabled={updateStatusMutation.isPending}
                className="flex-1 px-4 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Note'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMedicationsPage;
