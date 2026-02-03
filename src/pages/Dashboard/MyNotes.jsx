import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router';
import noteService from '@/services/noteService';
import toast from 'react-hot-toast';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

const MyNotes = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState(''); // '' = all, 'public', 'private'
  const [noteToDelete, setNoteToDelete] = useState(null);

  const params = {};
  if (visibilityFilter) params.visibility = visibilityFilter;
  if (searchQuery.trim()) params.search = searchQuery.trim();

  const { data: notesData, isLoading, error } = useQuery({
    queryKey: ['myNotes', params],
    queryFn: () => noteService.getMyNotes(params),
  });

  const notes = notesData?.data ?? [];

  const deleteNoteMutation = useMutation({
    mutationFn: noteService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['myNotes']);
      toast.success('Note deleted successfully');
      setNoteToDelete(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete note');
    },
  });

  const SkeletonLoader = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 h-4 rounded mb-3 w-3/4" />
          <div className="bg-gray-200 dark:bg-gray-800 h-3 rounded w-full mb-2" />
          <div className="bg-gray-200 dark:bg-gray-800 h-3 rounded w-2/3" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Notes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your rich-text notes
              </p>
            </div>
            <Link
              to="/dashboard/notes/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
              />
            </div>
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none min-w-[140px]"
            >
              <option value="">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load notes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later or refresh the page
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {params.search || params.visibility ? 'No notes match' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || visibilityFilter
                ? 'Try changing search or visibility filter'
                : 'Create your first note to get started'}
            </p>
            {!params.search && !params.visibility && (
              <Link
                to="/dashboard/notes/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Note
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => {
              const preview = stripHtml(note.content);
              const previewText = preview.length > 120 ? preview.slice(0, 120) + '...' : preview;
              return (
                <div
                  key={note._id}
                  className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                      {note.title}
                    </h3>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        note.visibility === 'private'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {note.visibility === 'private' ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Globe className="w-3 h-3" />
                      )}
                      {note.visibility}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                    {previewText || 'No content'}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(note.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/notes/${note._id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      onClick={() => setNoteToDelete(note)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{noteToDelete?.title}&quot;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => noteToDelete && deleteNoteMutation.mutate(noteToDelete._id)}
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyNotes;
