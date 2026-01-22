'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Heart } from 'lucide-react';
import { cn } from '@nobada/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  heartsRequired?: number;
  userHearts?: number;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = '메시지를 입력하세요...',
  heartsRequired = 1,
  userHearts = 0,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasEnoughHearts = userHearts >= heartsRequired;
  const canSend = message.trim() && !disabled && hasEnoughHearts;

  const handleSend = () => {
    if (canSend) {
      onSend(message.trim());
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-bottom">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled || !hasEnoughHearts}
              className={cn(
                'w-full min-h-[48px] max-h-[120px] px-4 py-3 pr-12',
                'bg-surface rounded-2xl resize-none',
                'text-text-primary placeholder:text-text-muted',
                'focus:outline-none focus:ring-2 focus:ring-primary',
                'transition-all duration-200',
                !hasEnoughHearts && 'opacity-50 cursor-not-allowed'
              )}
              rows={1}
            />

            {/* Hearts indicator */}
            <div className={cn(
              'absolute right-3 bottom-3 flex items-center gap-1 text-xs',
              hasEnoughHearts ? 'text-text-muted' : 'text-error'
            )}>
              <Heart className="w-3 h-3" />
              <span>{heartsRequired}</span>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center',
              'transition-all duration-200',
              canSend
                ? 'bg-primary text-white hover:bg-primary/90 active:scale-95'
                : 'bg-surface text-text-muted cursor-not-allowed'
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {!hasEnoughHearts && (
          <p className="mt-2 text-xs text-error text-center">
            하트가 부족합니다. (필요: {heartsRequired}, 보유: {userHearts})
          </p>
        )}
      </div>
    </div>
  );
}