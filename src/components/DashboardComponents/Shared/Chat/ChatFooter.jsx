import React, { useRef, useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, X, Sparkles, Mic, MapPin } from 'lucide-react';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ChatReplyBar from './ChatReplyBar';
import VoiceRecorder from './VoiceRecorder';
import LocationPicker from './LocationPicker';
import { useChat } from '@/hooks/use-chat';
import { useAuthStore } from '@/store/authStore';

const ChatFooter = ({ chatId, currentUserId, replyTo, onCancelReply }) => {
  const messageSchema = z.object({
    message: z.string().optional(),
  });
  const { user } = useAuthStore();

  const {
    sendMessage,
    sendAIMessage,
    isSendingMsg,
    isSendingAIMsg,
    isCurrentChatAI,
  } = useChat();

  // ✅ State to track if this is an AI chat
  const [isAI, setIsAI] = useState(false);
  const [isCheckingAI, setIsCheckingAI] = useState(false);

  // ✅ Check if this is an AI chat - only run when chatId changes
  useEffect(() => {
    let isMounted = true;

    const checkIfAI = async () => {
      if (!chatId) {
        setIsAI(false);
        return;
      }

      // Prevent multiple simultaneous checks
      if (isCheckingAI) return;

      setIsCheckingAI(true);
      console.log('🔍 Checking if chat is AI chat:', chatId);

      try {
        const result = await isCurrentChatAI(chatId);

        // Only update state if component is still mounted
        if (isMounted) {
          console.log('✅ isAI result:', result);
          setIsAI(result);
        }
      } catch (error) {
        console.error('Error checking AI chat:', error);
        if (isMounted) {
          setIsAI(false);
        }
      } finally {
        if (isMounted) {
          setIsCheckingAI(false);
        }
      }
    };

    checkIfAI();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [chatId]); // ✅ Only re-run when chatId changes

  const isSending = isAI ? isSendingAIMsg : isSendingMsg;

  const [image, setImage] = useState(null);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const imageInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: '',
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const onSubmit = async (values) => {
    if (isSending) return;
    if (!values.message?.trim() && !image) {
      toast.error('Please enter a message or select an image');
      return;
    }

    // ✅ Capture replyTo BEFORE clearing it
    const currentReplyTo = replyTo;

    const payload = {
      chatId,
      content: values.message,
      image: image || undefined,
      replyTo: currentReplyTo?._id || null,
      user,
    };

    // ✅ Use appropriate send function based on chat type
    console.log('The response for isAI is: ', isAI);
    if (isAI) {
      // AI chat - no images or replies supported
      if (image) {
        toast.error('AI chat does not support images yet');
        return;
      }

      console.log('🎯 ChatFooter: Calling sendAIMessage');
      console.log('📦 ChatFooter: Payload:', {
        chatId,
        content: values.message,
        user,
      });
      console.log('👤 ChatFooter: User object:', user);

      await sendAIMessage({
        chatId,
        content: values.message,
        user,
      });
    } else {
      // Regular chat
      await sendMessage(payload);
    }

    // Clear state AFTER sending
    onCancelReply();
    handleRemoveImage();
    form.reset();
  };

  return (
    <>
      <div
        className="sticky bottom-0
       inset-x-0 z-999
       bg-card border-t border-border py-4
      "
      >
        {image && !isSending && (
          <div className="max-w-6xl mx-auto px-8.5">
            <div className="relative w-fit">
              <img
                src={image}
                alt="Upload preview"
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

        {/* ✅ AI Indicator */}
        {isAI && (
          <div className="max-w-6xl mx-auto px-8.5 pb-2">
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium">Synapse AI Chat</span>
            </div>
          </div>
        )}

        <Form {...form}>
          {isRecordingMode ? (
            <div className="max-w-6xl px-8.5 mx-auto w-full">
              <VoiceRecorder
                chatId={chatId}
                replyTo={replyTo?._id}
                onCancel={() => setIsRecordingMode(false)}
              />
            </div>
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-6xl px-8.5 mx-auto
              flex items-end gap-2
              "
            >
              {/* ✅ Hide image upload for AI chats */}
              {!isAI && (
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isSending}
                    className="rounded-full"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={isSending}
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />
                </div>
              )}

              <FormField
                control={form.control}
                name="message"
                disabled={isSending}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Input
                      {...field}
                      autoComplete="off"
                      placeholder={
                        isAI ? 'Ask AI anything...' : 'Type new message'
                      }
                      className="min-h-10 bg-background"
                    />
                  </FormItem>
                )}
              />

              {/* ✅ Location & Microphone buttons (hide for AI chats) */}
              {!isAI && (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isSending}
                    className="rounded-full"
                    onClick={() => setIsLocationPickerOpen(true)}
                    title="Share Location"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isSending}
                    className="rounded-full"
                    onClick={() => setIsRecordingMode(true)}
                    title="Voice Message"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                size="icon"
                className={
                  isAI
                    ? 'rounded-lg bg-purple-600 hover:bg-purple-700'
                    : 'rounded-lg'
                }
                disabled={isSending}
              >
                {isSending ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </form>
          )}
        </Form>
      </div>

      {/* ✅ Hide reply bar for AI chats */}
      {replyTo && !isSending && !isAI && (
        <ChatReplyBar
          replyTo={replyTo}
          currentUserId={currentUserId}
          onCancel={onCancelReply}
        />
      )}

      {/* ✅ Location Picker Dialog */}
      <LocationPicker
        chatId={chatId}
        replyTo={replyTo?._id}
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
      />
    </>
  );
};

export default ChatFooter;
