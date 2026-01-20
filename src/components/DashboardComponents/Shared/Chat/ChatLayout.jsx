import React from 'react';
import { Outlet, useLocation } from 'react-router';
import ChatList from './ChatList';
import { MessageSquare, Sparkles, Users, Zap, ArrowRight } from 'lucide-react';

const ChatLayout = () => {
  const location = useLocation();
  const isChatSelected = location.pathname.includes('/dashboard/chat/');

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Chat List Sidebar */}
      <ChatList />

      {/* Chat Content Area - SingleChat will render here */}
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-background via-background to-muted/20">
        {!isChatSelected ? (
          // Enhanced Empty State
          <div className="max-w-2xl mx-auto px-8 text-center space-y-8">
            {/* Logo/Icon Section */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 mx-auto bg-linear-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-2xl">
                <MessageSquare
                  className="w-12 h-12 text-primary-foreground"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome to Synapse Chat
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Select a conversation from the sidebar or start a new chat to
                begin messaging
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  Chat with Whoop AI
                </p>
              </div>

              <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">Group Chats</h3>
                <p className="text-xs text-muted-foreground">
                  Create group conversations
                </p>
              </div>

              <div className="group p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-sm">Real-time</h3>
                <p className="text-xs text-muted-foreground">
                  Instant message delivery
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <button
                onClick={() => {
                  // This will be handled by the NewChatPopover in ChatList
                  document.querySelector('[data-new-chat-trigger]')?.click();
                }}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                Start New Chat
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => (window.location.href = '/about')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-all"
              >
                Learn More
              </button>
            </div>

            {/* Tips Section */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3 font-medium">
                Quick Tips:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground border border-border">
                  💬 Share images & files
                </span>
                <span className="px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground border border-border">
                  🤖 Ask Whoop AI anything
                </span>
                <span className="px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground border border-border">
                  ⚡ Real-time updates
                </span>
                <span className="px-3 py-1.5 bg-muted/50 rounded-full text-xs text-muted-foreground border border-border">
                  🔒 Secure & encrypted
                </span>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
