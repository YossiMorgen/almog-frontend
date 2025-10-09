import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ChatService } from '../../../services/chat.service';
import { ChatMessage, Conversation } from '../../../models/chat.models';
import { ChatMessageComponent } from '../../chat-message/chat-message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  messages$: Observable<ChatMessage[]>;
  isConnected$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  currentConversation$: Observable<Conversation | null>;

  newMessage = '';
  isTyping = false;
  typingTimeout: any;

  private destroy$ = new Subject<void>();

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
    this.isConnected$ = this.chatService.isConnected$;
    this.isLoading$ = this.chatService.isLoading$;
    this.currentConversation$ = this.chatService.currentConversation$;
  }

  ngOnInit(): void {
    // Auto-scroll to bottom when new messages arrive
    this.messages$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || this.isLoading$) {
      return;
    }

    const message = this.newMessage.trim();
    this.newMessage = '';

    // Get current conversation ID
    let conversationId: string | undefined;
    this.currentConversation$.pipe(takeUntil(this.destroy$)).subscribe((conv) => {
      conversationId = conv?.id;
    });

    this.chatService.sendMessage(message, conversationId);
    this.stopTyping();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else {
      this.startTyping();
    }
  }

  onInputChange(): void {
    if (this.newMessage.trim()) {
      this.startTyping();
    } else {
      this.stopTyping();
    }
  }

  private startTyping(): void {
    if (!this.isTyping) {
      this.isTyping = true;
      this.chatService.startTyping();
    }

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set new timeout to stop typing
    this.typingTimeout = setTimeout(() => {
      this.stopTyping();
    }, 1000);
  }

  private stopTyping(): void {
    if (this.isTyping) {
      this.isTyping = false;
      this.chatService.stopTyping();
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }

  clearChat(): void {
    this.chatService.createNewConversation();
  }

  onSuggestionClick(suggestion: string): void {
    this.newMessage = suggestion;
    this.sendMessage();
  }

  onActionClick(action: any): void {
    // Handle action execution
    console.log('Executing action:', action);
    // You can implement specific action handling here
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  focusInput(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }
}
