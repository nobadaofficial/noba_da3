'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, Info } from 'lucide-react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { VideoPlayer } from '../video/VideoPlayer';
import type { ChatSession, Message, Character, Episode } from '@nobada/types';
import { cn } from '@nobada/utils';

interface ChatScreenProps {
  session: ChatSession;
  episode: Episode;
  character: Character;
  userHearts: number;
  onSendMessage: (message: string) => Promise<void>;
  onBack?: () => void;
}

export function ChatScreen({
  session,
  episode,
  character,
  userHearts,
  onSendMessage,
  onBack,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>(session.messages || []);
  const [isTyping, setIsTyping] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message optimistically
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      await onSendMessage(content);
      // The actual response will be handled by the parent component
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
    } finally {
      setIsTyping(false);
    }
  };

  // Calculate relationship level
  const getRelationshipLevel = () => {
    const score = session.relationshipScore;
    if (score <= 20) return '낯선 사람';
    if (score <= 40) return '아는 사이';
    if (score <= 60) return '친구';
    if (score <= 80) return '가까운 친구';
    return '연인';
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-elevated">
        <div className="flex items-center gap-3 p-4">
          <button onClick={onBack} className="p-2 -m-2">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h1 className="font-bold">{character.name}</h1>
            <p className="text-xs text-text-muted">
              {getRelationshipLevel()} • 호감도 {session.relationshipScore}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-surface rounded-full">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{userHearts}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Video area */}
      {currentVideoUrl && (
        <div className="w-full bg-black">
          <VideoPlayer
            url={currentVideoUrl}
            autoPlay
            onEnded={() => setCurrentVideoUrl(null)}
          />
        </div>
      )}

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 pb-24 scroll-smooth"
      >
        {/* Episode intro */}
        {messages.length === 0 && (
          <div className="mb-4 p-4 bg-surface-elevated rounded-2xl">
            <h2 className="font-bold mb-2">{episode.title}</h2>
            <p className="text-sm text-text-secondary">{episode.description}</p>
          </div>
        )}

        {/* Intro video */}
        {messages.length === 0 && episode.introVideoUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden">
            <VideoPlayer
              url={episode.introVideoUrl}
              autoPlay={false}
              thumbnail={character.profileImage}
            />
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <ChatBubble
            key={message.id || index}
            message={message}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && <ChatBubble message={{} as Message} isTyping />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isTyping || session.status !== 'ACTIVE'}
        placeholder={
          session.status !== 'ACTIVE'
            ? '대화가 종료되었습니다'
            : '메시지를 입력하세요...'
        }
        heartsRequired={1}
        userHearts={userHearts}
      />
    </div>
  );
}