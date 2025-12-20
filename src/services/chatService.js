import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Chat Service
 * Handles all conversation-related API calls
 */

// Get current user ID helper
const getCurrentUserId = () => {
  return useAuthStore.getState().user?.id;
};

// Get all conversations for current user
export const getConversations = async () => {
  try {
    const response = await axios.get('/conversations');
    const conversations = response.data.data.conversations;
    const currentUserId = getCurrentUserId();
    
    // Transform backend data to frontend format
    return conversations.map((conv) => {
      // For direct chats, find the OTHER participant (not current user)
      const otherParticipant = conv.participants.find(
        (p) => p.userId._id !== currentUserId
      );
      
      const participantUser = otherParticipant?.userId;
      
      return {
        id: conv._id,
        type: conv.type,
        // For direct chats, show other person's name. For groups, show group name
        name: conv.type === 'group' 
          ? conv.name 
          : participantUser?.name || 'Unknown User',
        avatar: conv.avatar || null,
        participants: conv.participants,
        lastMessage: conv.lastMessage || null,
        updatedAt: conv.updatedAt,
        unreadCount: 0, // Will be implemented later with read receipts
      };
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

// Get single conversation by ID
export const getConversation = async (conversationId) => {
  try {
    const response = await axios.get(`/conversations/${conversationId}`);
    return response.data.data.conversation;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

// Create or get direct conversation
export const createDirectConversation = async (participantId) => {
  try {
    const response = await axios.post('/conversations/direct', {
      participantId,
    });
    return response.data.data.conversation;
  } catch (error) {
    console.error('Error creating direct conversation:', error);
    throw error;
  }
};

// Create group conversation
export const createGroupConversation = async (name, participantIds) => {
  try {
    const response = await axios.post('/conversations/group', {
      name,
      participantIds,
    });
    return response.data.data.conversation;
  } catch (error) {
    console.error('Error creating group conversation:', error);
    throw error;
  }
};

// Update group name
export const updateGroupName = async (conversationId, name) => {
  try {
    const response = await axios.patch(`/conversations/${conversationId}/name`, {
      name,
    });
    return response.data.data.conversation;
  } catch (error) {
    console.error('Error updating group name:', error);
    throw error;
  }
};

// Add member to group
export const addGroupMember = async (conversationId, userId) => {
  try {
    const response = await axios.post(`/conversations/${conversationId}/members`, {
      userId,
    });
    return response.data.data.conversation;
  } catch (error) {
    console.error('Error adding group member:', error);
    throw error;
  }
};

// Remove member from group
export const removeGroupMember = async (conversationId, userId) => {
  try {
    const response = await axios.delete(
      `/conversations/${conversationId}/members/${userId}`
    );
    return response.data.data.conversation;
  } catch (error) {
    console.error('Error removing group member:', error);
    throw error;
  }
};

// Delete/leave conversation
export const deleteConversation = async (conversationId) => {
  try {
    const response = await axios.delete(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};
