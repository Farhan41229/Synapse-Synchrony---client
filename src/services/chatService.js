// /Synapse-Synchrony---client/src/services/chatService.js
import api from './api'; // IMPORTANT: use your configured axios export
import { useAuthStore } from '../store/authStore';

/**
 * Chat Service
 * Handles all conversation-related API calls
 */

const getId = (maybe) => {
  if (!maybe) return null;
  if (typeof maybe === 'string') return maybe;
  return maybe.id || maybe._id || null;
};

const getCurrentUserId = () => getId(useAuthStore.getState().user);

export const getConversations = async () => {
  try {
    // no leading slash because baseURL already includes "/api"
    const response = await api.get('conversations');

    const conversations =
      response?.data?.data?.conversations ??
      response?.data?.conversations ??
      [];

    const currentUserId = getCurrentUserId();
    if (!Array.isArray(conversations)) return [];

    return conversations.map((conv) => {
      const convId = getId(conv);
      const participants = Array.isArray(conv?.participants) ? conv.participants : [];

      const otherParticipant =
        conv?.type === 'direct'
          ? participants.find((p) => getId(p?.userId) && getId(p.userId) !== currentUserId)
          : null;

      const participantUser = otherParticipant?.userId;

      return {
        id: convId,
        type: conv?.type || 'direct',
        name:
          conv?.type === 'group'
            ? (conv?.name || 'Group')
            : (participantUser?.name || 'Unknown User'),
        avatar: conv?.avatar || participantUser?.avatar || null,
        participants,
        lastMessage: conv?.lastMessage || null,
        updatedAt: conv?.updatedAt || conv?.createdAt || null,
        unreadCount: conv?.unreadCount ?? 0,
      };
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const getConversation = async (conversationId) => {
  try {
    const response = await api.get(`conversations/${conversationId}`);
    return (
      response?.data?.data?.conversation ??
      response?.data?.conversation ??
      response?.data?.data
    );
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

export const createDirectConversation = async (participantId) => {
  try {
    const response = await api.post('conversations/direct', { participantId });
    return (
      response?.data?.data?.conversation ??
      response?.data?.conversation ??
      response?.data?.data
    );
  } catch (error) {
    console.error('Error creating direct conversation:', error);
    throw error;
  }
};

export const createGroupConversation = async (name, participantIds) => {
  try {
    const response = await api.post('conversations/group', { name, participantIds });
    return (
      response?.data?.data?.conversation ??
      response?.data?.conversation ??
      response?.data?.data
    );
  } catch (error) {
    console.error('Error creating group conversation:', error);
    throw error;
  }
};

export const updateGroupName = async (conversationId, name) => {
  try {
    const response = await api.patch(`conversations/${conversationId}/name`, { name });
    return (
      response?.data?.data?.conversation ??
      response?.data?.conversation ??
      response?.data?.data
    );
  } catch (error) {
    console.error('Error updating group name:', error);
    throw error;
  }
};

export const addGroupMember = async (conversationId, userId) => {
  try {
    const response = await api.post(`conversations/${conversationId}/members`, { userId });
    return (
      response?.data?.data?.conversation ??
      response?.data?.conversation ??
      response?.data?.data
    );
  } catch (error) {
    console.error('Error adding group member:', error);
    throw error;
  }
};

export const removeGroupMember = async (conversationId, userId) => {
  try {
    const response = await api.delete(`conversations/${conversationId}/members/${userId}`);
    return (
      response?.data?.data?.conversation ??
      response?.data?.conversation ??
      response?.data?.data
    );
  } catch (error) {
    console.error('Error removing group member:', error);
    throw error;
  }
};

export const deleteConversation = async (conversationId) => {
  try {
    const response = await api.delete(`conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};
