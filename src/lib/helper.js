import { format, isToday, isYesterday, isThisWeek } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '@/hooks/use-socket';

export const isUserOnline = (userId) => {
  if (!userId) return false;
  const { onlineUsers } = useSocket.getState();
  return onlineUsers.includes(userId);
};

export const getOtherUserAndGroup = (chat, currentUserId) => {
  // Safety check
  if (!chat) {
    return {
      name: 'Unknown',
      subheading: 'Offline',
      avatar: '',
      isGroup: false,
      isOnline: false,
      isAI: false,
    };
  }

  const isGroup = chat?.isGroup;

  if (isGroup) {
    const participantsCount = chat.participants?.length || 0;
    return {
      name: chat.groupName || 'Unnamed Group',
      subheading: `${participantsCount} members`,
      avatar: '',
      isGroup,
    };
  }

  // Safety check for participants array
  if (!chat.participants || !Array.isArray(chat.participants)) {
    return {
      name: 'Unknown',
      subheading: 'Offline',
      avatar: '',
      isGroup: false,
      isOnline: false,
      isAI: false,
    };
  }

  const other = chat.participants.find((p) => p._id !== currentUserId);

  // If no other participant found
  if (!other) {
    return {
      name: 'Unknown',
      subheading: 'Offline',
      avatar: '',
      isGroup: false,
      isOnline: false,
      isAI: false,
    };
  }

  const isOnline = isUserOnline(other._id ?? '');

  return {
    name: other.name || 'Unknown',
    subheading: isOnline ? 'Online' : 'Offline',
    avatar: other.avatar || '',
    isGroup: false,
    isOnline,
    isAI: other.isAI || false,
  };
};

export const formatChatTime = (date) => {
  if (!date) return '';
  const newDate = new Date(date);
  if (isNaN(newDate.getTime())) return 'Invalid date';

  if (isToday(newDate)) return format(newDate, 'h:mm a');
  if (isYesterday(newDate)) return 'Yesterday';
  if (isThisWeek(newDate)) return format(newDate, 'EEEE');
  return format(newDate, 'M/d');
};

export function generateUUID() {
  return uuidv4();
}
