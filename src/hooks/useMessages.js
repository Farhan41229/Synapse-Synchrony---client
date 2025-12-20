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
      setMessages(res.messages || []);
      setHasMore(res.pagination?.hasMore ?? false);
      setNextCursor(res.pagination?.nextCursor ?? null);

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
      const older = res.messages || [];
      setMessages((prev) => [...older, ...prev]);

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

    if (conversationId) loadInitial();
  }, [conversationId, loadInitial]);

  // optimistic append + dedupe by id
  const appendMessage = useCallback((msg) => {
    if (!msg) return;
    const id = msg.id || msg._id;

    setMessages((prev) => {
      if (id && prev.some((m) => (m.id || m._id) === id)) return prev;
      return [...prev, { ...msg, id }];
    });
  }, []);

  // update message content/status by id (for edited event)
  const updateMessage = useCallback((patch) => {
    if (!patch) return;
    const id = patch.id || patch._id;
    if (!id) return;

    setMessages((prev) =>
      prev.map((m) => ((m.id || m._id) === id ? { ...m, ...patch, id } : m))
    );
  }, []);

  // soft-delete in UI by id (for deleted event)
  const markMessageDeleted = useCallback((messageId) => {
    if (!messageId) return;

    setMessages((prev) =>
      prev.map((m) =>
        (m.id || m._id) === messageId
          ? { ...m, isDeleted: true, content: '', attachments: [] }
          : m
      )
    );
  }, []);

  return {
    messages,
    hasMore,
    nextCursor,
    isLoadingInitial,
    isLoadingOlder,
    loadOlder,
    reload: loadInitial,
    appendMessage,
    updateMessage,
    markMessageDeleted,
  };
}
