import api from './api'; // configured axios instance (baseURL + interceptors)

const normalizeMessage = (msg) => ({
  id: msg._id,
  conversationId: msg.conversationId,
  senderId: msg.senderId?._id || msg.senderId,
  sender: msg.senderId,
  content: msg.content,
  type: msg.type,
  attachments: msg.attachments || [],
  createdAt: msg.createdAt,
  updatedAt: msg.updatedAt,
  isEdited: msg.isEdited,
  isDeleted: msg.isDeleted,
});

export const getMessages = async (
  conversationId,
  { limit = 50, before = null } = {}
) => {
  const params = { limit };
  if (before) params.before = before;

  const res = await api.get(`/conversations/${conversationId}/messages`, { params });

  const data = res.data?.data || {};
  const pagination = data.pagination || {};

  // Backend often returns newest -> oldest; UI should be oldest -> newest
  const raw = data.messages || [];
  const ordered = raw.slice().reverse();

  return {
    messages: ordered.map(normalizeMessage),
    pagination: {
      hasMore: !!pagination.hasMore,
      nextCursor: pagination.nextCursor ?? null,
      prevCursor: pagination.prevCursor ?? null,
      count: pagination.count ?? ordered.length,
      limit: pagination.limit ?? limit,
    },
  };
};

export const sendMessage = async (conversationId, content, type = 'text') => {
  const res = await api.post(`/conversations/${conversationId}/messages`, {
    content,
    type,
  });

  const msg = res.data?.data?.message;
  return normalizeMessage(msg);
};

export const editMessage = async (conversationId, messageId, content) => {
  const res = await api.patch(
    `/conversations/${conversationId}/messages/${messageId}`,
    { content }
  );
  return res.data?.data?.message;
};

export const deleteMessage = async (conversationId, messageId) => {
  const res = await api.delete(
    `/conversations/${conversationId}/messages/${messageId}`
  );
  return res.data;
};

export const markMessagesAsRead = async (conversationId, messageId = null) => {
  const res = await api.post(
    `/conversations/${conversationId}/messages/read`,
    messageId ? { messageId } : {}
  );
  return res.data;
};

export const getUnreadCount = async (conversationId) => {
  const res = await api.get(
    `/conversations/${conversationId}/messages/unread-count`
  );
  return res.data?.data?.unreadCount;
};
