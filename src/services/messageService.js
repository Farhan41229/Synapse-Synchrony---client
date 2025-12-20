import axios from 'axios';

/**
 * Message Service
 * Handles all message-related API calls
 */

// Get messages for a conversation (with pagination)
export const getMessages = async (conversationId, limit = 50, before = null) => {
  try {
    const params = { limit };
    if (before) {
      params.before = before;
    }

    const response = await axios.get(
      `/conversations/${conversationId}/messages`,
      { params }
    );
    
    const messages = response.data.data.messages || [];
    
    // Transform backend data to frontend format
    return {
      messages: messages.map((msg) => ({
        id: msg._id, // Transform _id to id
        conversationId: msg.conversationId,
        senderId: msg.senderId?._id || msg.senderId,
        sender: msg.senderId, // Full sender object
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
        isEdited: msg.isEdited,
        isDeleted: msg.isDeleted,
      })),
      hasMore: response.data.data.hasMore || false,
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};


// Send a new message
export const sendMessage = async (conversationId, content, type = 'text') => {
  try {
    const response = await axios.post(
      `/conversations/${conversationId}/messages`,
      {
        content,
        type,
      }
    );
    
    const msg = response.data.data.message;
    
    // Transform to frontend format
    return {
      id: msg._id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      content: msg.content,
      type: msg.type,
      createdAt: msg.createdAt,
      isEdited: false,
      isDeleted: false,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};


// Edit a message
export const editMessage = async (conversationId, messageId, content) => {
  try {
    const response = await axios.patch(
      `/conversations/${conversationId}/messages/${messageId}`,
      {
        content,
      }
    );
    return response.data.data.message;
  } catch (error) {
    console.error('Error editing message:', error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (conversationId, messageId) => {
  try {
    const response = await axios.delete(
      `/conversations/${conversationId}/messages/${messageId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId, messageId = null) => {
  try {
    const response = await axios.post(
      `/conversations/${conversationId}/messages/read`,
      messageId ? { messageId } : {}
    );
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Get unread message count
export const getUnreadCount = async (conversationId) => {
  try {
    const response = await axios.get(
      `/conversations/${conversationId}/messages/unread-count`
    );
    return response.data.data.unreadCount;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};
