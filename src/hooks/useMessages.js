import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getMessages, markMessagesAsRead } from '../services/messageService';

export default function useMessages(conversationId, { limit = 50 } = {}) {
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);

  const loadInitial = useCallback(async () => {
    if (!conversationId) return;
    setIsLoadingInitial(true);
    try {
      const res = await getMessages(conversationId, { limit });
      setMessages(res.messages);
      setHasMore(res.pagination?.hasMore ?? false);
      setNextCursor(res.pagination?.nextCursor ?? null);

      // ✅ this line is what was crashing before
      await markMessagesAsRead(conversationId);
    } catch (e) {
      toast.error('Failed to load messages');
      throw e;
    } finally {
      setIsLoadingInitial(false);
    }
  }, [conversationId, limit]);

  const loadOlder = useCallback(async () => {
    if (!conversationId || !hasMore || !nextCursor) return;
    setIsLoadingOlder(true);
    try {
      const res = await getMessages(conversationId, { limit, before: nextCursor });
      setMessages((prev) => [...res.messages, ...prev]);
      setHasMore(res.pagination?.hasMore ?? false);
      setNextCursor(res.pagination?.nextCursor ?? null);
    } catch (e) {
      toast.error('Failed to load older messages');
      throw e;
    } finally {
      setIsLoadingOlder(false);
    }
  }, [conversationId, hasMore, nextCursor, limit]);

  useEffect(() => {
    setMessages([]);
    setHasMore(false);
    setNextCursor(null);
    loadInitial();
  }, [conversationId, loadInitial]);

  const appendMessage = useCallback((msg) => {
    if (!msg) return;
    setMessages((prev) => [...prev, msg]);
  }, []);

  return { messages, hasMore, nextCursor, isLoadingInitial, isLoadingOlder, loadOlder, reload: loadInitial, appendMessage };
}
