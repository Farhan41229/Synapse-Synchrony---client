Ok, so just like the last time, you will have to convert the code from the youtuber's code to my code. Remember that my code is in jsx and his are in tsx

# Youtuber's Code

## SingleChat.tsx

```tsx
import ChatBody from "@/components/chat/chat-body";
import ChatFooter from "@/components/chat/chat-footer";
import ChatHeader from "@/components/chat/chat-header";
import EmptyState from "@/components/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import useChatId from "@/hooks/use-chat-id";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "@/types/chat.type";
import { useEffect, useState } from "react";

const SingleChat = () => {
  const chatId = useChatId();
  const { fetchSingleChat, isSingleChatLoading, singleChat } = useChat();
  const { socket } = useSocket();
  const { user } = useAuth();

  const [replyTo, setReplyTo] = useState<MessageType | null>(null);

  const currentUserId = user?._id || null;
  const chat = singleChat?.chat;
  const messages = singleChat?.messages || [];

  useEffect(() => {
    if (!chatId) return;
    fetchSingleChat(chatId);
  }, [fetchSingleChat, chatId]);

  //Socket Chat room
  useEffect(() => {
    if (!chatId || !socket) return;

    socket.emit("chat:join", chatId);
    return () => {
      socket.emit("chat:leave", chatId);
    };
  }, [chatId, socket]);

  if (isSingleChatLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner className="w-11 h-11 !text-primary" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="relative h-svh flex flex-col">
      <ChatHeader chat={chat} currentUserId={currentUserId} />

      <div className="flex-1 overflow-y-auto bg-background">
        {messages.length === 0 ? (
          <EmptyState
            title="Start a conversation"
            description="No messages yet. Send the first message"
          />
        ) : (
          <ChatBody chatId={chatId} messages={messages} onReply={setReplyTo} />
        )}
      </div>

      <ChatFooter
        replyTo={replyTo}
        chatId={chatId}
        currentUserId={currentUserId}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default SingleChat;
```
## ChatHeader.tsx

```tsx
import { getOtherUserAndGroup } from "@/lib/helper";
import { PROTECTED_ROUTES } from "@/routes/routes";
import type { ChatType } from "@/types/chat.type";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AvatarWithBadge from "../avatar-with-badge";

interface Props {
  chat: ChatType;
  currentUserId: string | null;
}
const ChatHeader = ({ chat, currentUserId }: Props) => {
  const navigate = useNavigate();
  const { name, subheading, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId
  );

  return (
    <div
      className="sticky top-0
    flex items-center gap-5 border-b border-border
    bg-card px-2 z-50
    "
    >
      <div className="h-14 px-4 flex items-center">
        <div>
          <ArrowLeft
            className="w-5 h-5 inline-block lg:hidden
          text-muted-foreground cursor-pointer
          mr-2
          "
            onClick={() => navigate(PROTECTED_ROUTES.CHAT)}
          />
        </div>
        <AvatarWithBadge
          name={name}
          src={avatar}
          isGroup={isGroup}
          isOnline={isOnline}
        />
        <div className="ml-2">
          <h5 className="font-semibold">{name}</h5>
          <p
            className={`text-sm ${
              isOnline ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {subheading}
          </p>
        </div>
      </div>
      <div>
        <div
          className={`flex-1
            text-center
            py-4 h-full
            border-b-2
            border-primary
            font-medium
            text-primary`}
        >
          Chat
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
```
## ChatBody.tsx

```tsx
import { useChat } from "@/hooks/use-chat";
import { useSocket } from "@/hooks/use-socket";
import type { MessageType } from "@/types/chat.type";
import { useEffect, useRef } from "react";
import ChatBodyMessage from "./chat-body-message";

interface Props {
  chatId: string | null;
  messages: MessageType[];
  onReply: (message: MessageType) => void;
}
const ChatBody = ({ chatId, messages, onReply }: Props) => {
  const { socket } = useSocket();
  const { addNewMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chatId) return;
    if (!socket) return;

    const handleNewMessage = (msg: MessageType) => addNewMessage(chatId, msg);

    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, chatId, addNewMessage]);

  useEffect(() => {
    if (!messages.length) return;
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col px-3 py-2">
      {messages.map((message) => (
        <ChatBodyMessage
          key={message._id}
          message={message}
          onReply={onReply}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBody;
```
## ChatBodyMassage.tsx

```tsx
import { memo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { MessageType } from "@/types/chat.type";
import AvatarWithBadge from "../avatar-with-badge";
import { formatChatTime } from "@/lib/helper";
import { Button } from "../ui/button";
import { ReplyIcon } from "lucide-react";

interface Props {
  message: MessageType;
  onReply: (message: MessageType) => void;
}
const ChatMessageBody = memo(({ message, onReply }: Props) => {
  const { user } = useAuth();

  const userId = user?._id || null;
  const isCurrentUser = message.sender?._id === userId;
  const senderName = isCurrentUser ? "You" : message.sender?.name;

  const replySendername =
    message.replyTo?.sender?._id === userId
      ? "You"
      : message.replyTo?.sender?.name;

  const containerClass = cn(
    "group flex gap-2 py-3 px-4",
    isCurrentUser && "flex-row-reverse text-left"
  );

  const contentWrapperClass = cn(
    "max-w-[70%]  flex flex-col relative",
    isCurrentUser && "items-end"
  );

  const messageClass = cn(
    "min-w-[200px] px-3 py-2 text-sm break-words shadow-sm",
    isCurrentUser
      ? "bg-accent dark:bg-primary/40 rounded-tr-xl rounded-l-xl"
      : "bg-[#F5F5F5] dark:bg-accent rounded-bl-xl rounded-r-xl"
  );

  const replyBoxClass = cn(
    `mb-2 p-2 text-xs rounded-md border-l-4 shadow-md !text-left`,
    isCurrentUser
      ? "bg-primary/20 border-l-primary"
      : "bg-gray-200 dark:bg-secondary border-l-[#CC4A31]"
  );
  return (
    <div className={containerClass}>
      {!isCurrentUser && (
        <div className="flex-shrink-0 flex items-start">
          <AvatarWithBadge
            name={message.sender?.name || "No name"}
            src={message.sender?.avatar || ""}
          />
        </div>
      )}

      <div className={contentWrapperClass}>
        <div
          className={cn(
            "flex items-center gap-1",
            isCurrentUser && "flex-row-reverse"
          )}
        >
          <div className={messageClass}>
            {/* {Header} */}

            <div className="flex items-center gap-2 mb-0.5 pb-1">
              <span className="text-xs font-semibold">{senderName}</span>
              <span className="text-[11px] text-gray-700 dark:text-gray-300">
                {formatChatTime(message?.createdAt)}
              </span>
            </div>

            {/* ReplyToBox */}
            {message.replyTo && (
              <div className={replyBoxClass}>
                <h5 className="font-medium">{replySendername}</h5>
                <p
                  className="font-normal text-muted-foreground
                 max-w-[250px]  truncate
                "
                >
                  {message?.replyTo?.content ||
                    (message?.replyTo?.image ? "📷 Photo" : "")}
                </p>
              </div>
            )}

            {message?.image && (
              <img
                src={message?.image || ""}
                alt=""
                className="rounded-lg max-w-xs"
              />
            )}

            {message.content && <p>{message.content}</p>}
          </div>

          {/* {Reply Icon Button} */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onReply(message)}
            className="flex opacity-0 group-hover:opacity-100
            transition-opacity rounded-full !size-8
            "
          >
            <ReplyIcon
              size={16}
              className={cn(
                "text-gray-500 dark:text-white !stroke-[1.9]",
                isCurrentUser && "scale-x-[-1]"
              )}
            />
          </Button>
        </div>

        {message.status && (
          <span
            className="block
           text-[10px] text-gray-400 mt-0.5"
          >
            {message.status}
          </span>
        )}
      </div>
    </div>
  );
});

ChatMessageBody.displayName = "ChatMessageBody";

export default ChatMessageBody;
```
## ChatFooter.tsx

```tsx
import { z } from "zod";
import type { MessageType } from "@/types/chat.type";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Paperclip, Send, X } from "lucide-react";
import { Form, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import ChatReplyBar from "./chat-reply-bar";
import { useChat } from "@/hooks/use-chat";

interface Props {
  chatId: string | null;
  currentUserId: string | null;
  replyTo: MessageType | null;
  onCancelReply: () => void;
}
const ChatFooter = ({
  chatId,
  currentUserId,
  replyTo,
  onCancelReply,
}: Props) => {
  const messageSchema = z.object({
    message: z.string().optional(),
  });

  const { sendMessage, isSendingMsg } = useChat();

  const [image, setImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onSubmit = (values: { message?: string }) => {
    if (isSendingMsg) return;
    if (!values.message?.trim() && !image) {
      toast.error("Please enter a message or select an image");
      return;
    }
    const payload = {
      chatId,
      content: values.message,
      image: image || undefined,
      replyTo: replyTo,
    };
    //Send Message
    sendMessage(payload);

    onCancelReply();
    handleRemoveImage();
    form.reset();
  };
  return (
    <>
      <div
        className="sticky bottom-0
       inset-x-0 z-[999]
       bg-card border-t border-border py-4
      "
      >
        {image && !isSendingMsg && (
          <div className="max-w-6xl mx-auto px-8.5">
            <div className="relative w-fit">
              <img
                src={image}
                className="object-contain h-16 bg-muted min-w-16"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-px right-1
                 bg-black/50 text-white rounded-full
                 cursor-pointer
                "
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-6xl px-8.5 mx-auto
            flex items-end gap-2
            "
          >
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isSendingMsg}
                className="rounded-full"
                onClick={() => imageInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                disabled={isSendingMsg}
                ref={imageInputRef}
                onChange={handleImageChange}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              disabled={isSendingMsg}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Input
                    {...field}
                    autoComplete="off"
                    placeholder="Type new message"
                    className="min-h-[40px] bg-background"
                  />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="icon"
              className="rounded-lg"
              disabled={isSendingMsg}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </Form>
      </div>

      {replyTo && !isSendingMsg && (
        <ChatReplyBar
          replyTo={replyTo}
          currentUserId={currentUserId}
          onCancel={onCancelReply}
        />
      )}
    </>
  );
};

export default ChatFooter;
```
## ChatReplyBar.tsx

```tsx
import { z } from "zod";
import type { MessageType } from "@/types/chat.type";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Paperclip, Send, X } from "lucide-react";
import { Form, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import ChatReplyBar from "./chat-reply-bar";
import { useChat } from "@/hooks/use-chat";

interface Props {
  chatId: string | null;
  currentUserId: string | null;
  replyTo: MessageType | null;
  onCancelReply: () => void;
}
const ChatFooter = ({
  chatId,
  currentUserId,
  replyTo,
  onCancelReply,
}: Props) => {
  const messageSchema = z.object({
    message: z.string().optional(),
  });

  const { sendMessage, isSendingMsg } = useChat();

  const [image, setImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onSubmit = (values: { message?: string }) => {
    if (isSendingMsg) return;
    if (!values.message?.trim() && !image) {
      toast.error("Please enter a message or select an image");
      return;
    }
    const payload = {
      chatId,
      content: values.message,
      image: image || undefined,
      replyTo: replyTo,
    };
    //Send Message
    sendMessage(payload);

    onCancelReply();
    handleRemoveImage();
    form.reset();
  };
  return (
    <>
      <div
        className="sticky bottom-0
       inset-x-0 z-[999]
       bg-card border-t border-border py-4
      "
      >
        {image && !isSendingMsg && (
          <div className="max-w-6xl mx-auto px-8.5">
            <div className="relative w-fit">
              <img
                src={image}
                className="object-contain h-16 bg-muted min-w-16"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-px right-1
                 bg-black/50 text-white rounded-full
                 cursor-pointer
                "
                onClick={handleRemoveImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-6xl px-8.5 mx-auto
            flex items-end gap-2
            "
          >
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={isSendingMsg}
                className="rounded-full"
                onClick={() => imageInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                disabled={isSendingMsg}
                ref={imageInputRef}
                onChange={handleImageChange}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              disabled={isSendingMsg}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Input
                    {...field}
                    autoComplete="off"
                    placeholder="Type new message"
                    className="min-h-[40px] bg-background"
                  />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="icon"
              className="rounded-lg"
              disabled={isSendingMsg}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </Form>
      </div>

      {replyTo && !isSendingMsg && (
        <ChatReplyBar
          replyTo={replyTo}
          currentUserId={currentUserId}
          onCancel={onCancelReply}
        />
      )}
    </>
  );
};

export default ChatFooter;
```
## EmptyState.tsx

```tsx
import Logo from "./logo";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";

interface Props {
  title?: string;
  description?: string;
}

const EmptyState = ({
  title = "No chat selected",
  description = "Pick a chat or start a new one...",
}: Props) => {
  return (
    <Empty
      className="w-full h-full flex-1
    flex items-center justify-center bg-muted/20"
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Logo showText={false} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;
```
## Logo.tsx

```tsx
import { Link } from "react-router-dom";
import logoSvg from "@/assets/whop-logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  url?: string;
  showText?: boolean;
  imgClass?: string;
  textClass?: string;
}

const Logo = ({
  url = "/",
  showText = true,
  imgClass = "size-[30px]",
  textClass,
}: LogoProps) => (
  <Link to={url} className="flex items-center gap-2 w-fit">
    <img src={logoSvg} alt="Whop" className={cn(imgClass)} />
    {showText && (
      <span className={cn("font-semibold text-lg leading-tight", textClass)}>
        Whop.
      </span>
    )}
  </Link>
);

export default Logo;
```
# My Code

## SingleChat.jsx

```jsx
import React from 'react';
import ChatBody from './ChatBody';
import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import EmptyState from './EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/store/authStore';
import { useChat } from '@/hooks/use-chat';
import useChatId from '@/hooks/use-chat-id';
import { useSocket } from '@/hooks/use-socket';
import { useEffect, useState } from 'react';
const SingleChat = () => {
  return (
    <div>
      <h1>Single Chat</h1>
    </div>
  );
};

export default SingleChat;

```
## ChatHeader.jsx

```jsx
import React from 'react';
import { getOtherUserAndGroup } from '@/lib/helper';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import AvatarWithBadge from './AvatarWithBadge';
const ChatHeader = () => {
  return (
    <div>
      <h1>Chat Header</h1>
    </div>
  );
};

export default ChatHeader;

```
## ChatBody.jsx

```jsx
import React from 'react';
import { useChat } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import { useEffect, useRef } from 'react';
import ChatBodyMessage from './ChatBodyMessage';

const ChatBody = () => {
  return (
    <div>
      <h1>Chat Body</h1>
    </div>
  );
};

export default ChatBody;

```
## ChatBodyMassage.jsx

```jsx
import React from 'react';
import { memo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

import AvatarWithBadge from './AvatarWithBadge';
import { formatChatTime } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import { ReplyIcon } from 'lucide-react';
const ChatBodyMessage = () => {
  return (
    <div>
      <h1>Chat Body Message</h1>
    </div>
  );
};

export default ChatBodyMessage;

```
## ChatFooter.jsx

```jsx
import React from 'react';
import { z } from 'zod';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '../../../ui/button';
import { Paperclip, Send, X } from 'lucide-react';
import { Form, FormField, FormItem } from '../../../ui/form';
import { Input } from '../../../ui/input';
import ChatReplyBar from './ChatReplyBar';
import { useChat } from '@/hooks/use-chat';
const ChatFooter = () => {
  return (
    <div>
      <h1>Chat Footer</h1>
    </div>
  );
};

export default ChatFooter;

```
## ChatReplyBar.jsx

```jsx
import React from 'react';

const ChatReplyBar = () => {
  return (
    <div>
      <h1>Chat Reply Bar</h1>
    </div>
  );
};

export default ChatReplyBar;

```
## EmptyState.jsx

```jsx
import Logo from '../Logo/Logo';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty';



const EmptyState = ({
  title = 'No chat selected',
  description = 'Pick a chat or start a new one...',
}) => {
  return (
    <Empty
      className="w-full h-full flex-1
    flex items-center justify-center bg-muted/20"
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Logo showText={false} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;

```
## Logo.jsx

```jsx
import { Link } from 'react-router';
import logoSvg from '@/assets/whop-logo.svg';
import { cn } from '@/lib/utils';

const Logo = ({
  url = '/',
  showText = true,
  imgClass = 'size-[30px]',
  textClass,
}) => (
  <Link to={url} className="flex items-center gap-2 w-fit">
    <img src={logoSvg} alt="Whop" className={cn(imgClass)} />
    {showText && (
      <span className={cn('font-semibold text-lg leading-tight', textClass)}>
        Whop.
      </span>
    )}
  </Link>
);

export default Logo;

```