import React from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import noteService from '@/services/noteService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  Lock,
  Globe,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const { data: noteData, isLoading, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => noteService.getNoteById(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: noteService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries(['myNotes']);
      toast.success('Note deleted successfully');
      setShowDeleteConfirm(false);
      navigate('/dashboard/notes');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete note');
    },
  });

  const note = noteData?.data;
  const authorId = note?.author?._id?.toString?.() ?? note?.author?.toString?.();
  const isAuthor = user?._id && authorId && user._id === authorId;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#04642a]" />
      </div>
    );
  }

  if (error || !note) {
    const msg =
      error?.response?.status === 403
        ? 'You do not have access to this note'
        : 'Note not found';
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8 px-4 flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-gray-700 dark:text-gray-300 mb-4">{msg}</p>
        <Link to="/dashboard/notes" className="text-[#04642a] hover:underline">
          Back to My Notes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard/notes"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {note.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
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
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                {note.updatedAt &&
                  note.updatedAt !== note.createdAt &&
                  ` · Updated ${format(new Date(note.updatedAt), 'MMM dd, yyyy')}`}
              </span>
              {note.author?.name && (
                <span className="text-gray-600 dark:text-gray-300">
                  {note.author.name}
                </span>
              )}
            </div>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/dashboard/notes/${note._id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div
          className="note-content prose prose-sm dark:prose-invert max-w-none min-w-0 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-6"
          dangerouslySetInnerHTML={{ __html: note.content || '<p></p>' }}
        />
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{note.title}&quot;? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(note._id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
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

export default NoteDetail;
