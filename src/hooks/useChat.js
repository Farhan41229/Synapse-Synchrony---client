// /Synapse-Synchrony---client/src/hooks/useChat.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as chatService from '../services/chatService';

export default function useChat({ autoSelectFirst = true } = {}) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);

  const refreshConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const data = await chatService.getConversations();
      setConversations(data);
      return data;
    } catch (e) {
      toast.error('Failed to load conversations');
      throw e;
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    if (!autoSelectFirst) return;
    if (selectedConversationId) return;
    if (conversations.length === 0) return;
    setSelectedConversationId(conversations[0].id);
  }, [autoSelectFirst, conversations, selectedConversationId]);

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  const selectConversation = useCallback((conversation) => {
    const id = conversation?.id || conversation;
    if (!id) return;
    setSelectedConversationId(id);
  }, []);

  return {
    conversations,
    selectedConversation,
    selectedConversationId,
    isLoadingConversations,
    refreshConversations,
    selectConversation,
    setSelectedConversationId,
  };
}
