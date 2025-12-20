import { useEffect, useMemo, useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { searchUsers } from '../../services/searchService';
import { createDirectConversation } from '../../services/chatService';

const NewChatModal = ({ open, onClose, onCreated }) => {
  const { user: me } = useAuthStore();

  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const visible = !!open;

  useEffect(() => {
    if (!visible) {
      setQ('');
      setResults([]);
      setIsSearching(false);
      setIsCreating(false);
    }
  }, [visible]);

  // Small debounce without extra deps
  useEffect(() => {
    if (!visible) return;

    const query = q.trim();
    if (!query) {
      setResults([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setIsSearching(true);
        const users = await searchUsers(query);

        // Filter self (backend may already do it, but safe)
        const filtered = users.filter((u) => (u._id || u.id) !== me?.id);
        setResults(filtered);
      } catch {
        toast.error('Failed to search users');
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [q, visible, me?.id]);

  const title = useMemo(() => (isCreating ? 'Starting chat...' : 'New chat'), [isCreating]);

  const handlePickUser = async (pickedUser) => {
    const userId = pickedUser._id || pickedUser.id;
    if (!userId) return;

    try {
      setIsCreating(true);
      const conv = await createDirectConversation(userId);
      onCreated?.(conv);
      onClose?.();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to start chat');
    } finally {
      setIsCreating(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-secondary"
            aria-label="Close modal"
            disabled={isCreating}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-border bg-secondary pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              disabled={isCreating}
            />
          </div>

          <div className="mt-4 max-h-[52vh] overflow-y-auto">
            {isSearching && (
              <p className="text-sm text-muted-foreground">Searching...</p>
            )}

            {!isSearching && q.trim() && results.length === 0 && (
              <p className="text-sm text-muted-foreground">No users found.</p>
            )}

            <div className="space-y-2">
              {results.map((u) => {
                const id = u._id || u.id;
                const name = u.name || 'Unknown';
                const email = u.email || '';

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handlePickUser(u)}
                    disabled={isCreating}
                    className="w-full rounded-lg border border-border p-3 text-left hover:bg-secondary disabled:opacity-60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{name}</p>
                        <p className="truncate text-sm text-muted-foreground">{email}</p>
                      </div>
                      <span className="text-sm text-primary">Chat</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Tip: search by email to quickly find a specific person.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
