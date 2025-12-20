export const SOCKET_EVENTS = {
  // rooms
  CONVERSATION_JOIN: 'conversation:join',
  CONVERSATION_LEAVE: 'conversation:leave',

  // messaging
  MESSAGE_NEW: 'message:new',
  MESSAGE_SEND: 'message:send',

  // note: your backend emits these exact names:
  MESSAGE_EDITED: 'message:edited',
  MESSAGE_DELETED: 'message:deleted',

  // typing/presence (later phases)
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  PRESENCE_UPDATE: 'presence:update',
};
