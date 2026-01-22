'use client';

import { cn } from '@nobada/utils';
import type { Message, EmotionType } from '@nobada/types';

interface ChatBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export function ChatBubble({ message, isTyping = false }: ChatBubbleProps) {
  const isUser = message.role === 'USER';
  const isAI = message.role === 'AI';

  const getEmotionColor = (emotion?: EmotionType) => {
    if (!emotion) return '';

    const emotionColors = {
      happy: 'bg-yellow-100 dark:bg-yellow-900/20',
      sad: 'bg-blue-100 dark:bg-blue-900/20',
      angry: 'bg-red-100 dark:bg-red-900/20',
      excited: 'bg-orange-100 dark:bg-orange-900/20',
      romantic: 'bg-pink-100 dark:bg-pink-900/20',
      shy: 'bg-purple-100 dark:bg-purple-900/20',
      neutral: 'bg-gray-100 dark:bg-gray-900/20',
    };

    return emotionColors[emotion] || '';
  };

  if (isTyping) {
    return (
      <div className="flex w-full mb-4 justify-start animate-pulse">
        <div className="relative max-w-[85%] rounded-2xl px-5 py-3 bg-surface-elevated rounded-bl-sm">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex w-full mb-4 animate-in slide-in-from-bottom-2 fade-in duration-300',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'relative max-w-[85%] rounded-2xl px-5 py-3 shadow-sm',
        isUser
          ? 'bg-primary text-white rounded-br-sm'
          : cn(
              'bg-white dark:bg-surface-elevated text-gray-900 dark:text-gray-100 rounded-bl-sm',
              getEmotionColor(message.emotion)
            )
      )}>
        {/* Emotion indicator for AI messages */}
        {isAI && message.emotion && message.emotion !== 'neutral' && (
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center">
            {message.emotion === 'happy' && '😊'}
            {message.emotion === 'sad' && '😢'}
            {message.emotion === 'angry' && '😠'}
            {message.emotion === 'excited' && '🤩'}
            {message.emotion === 'romantic' && '🥰'}
            {message.emotion === 'shy' && '😳'}
          </div>
        )}

        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Relationship change indicator */}
        {message.relationshipDelta && message.relationshipDelta !== 0 && (
          <div className={cn(
            'mt-2 text-xs font-medium',
            message.relationshipDelta > 0 ? 'text-green-600' : 'text-red-600'
          )}>
            호감도 {message.relationshipDelta > 0 ? '+' : ''}{message.relationshipDelta}
          </div>
        )}
      </div>
    </div>
  );
}