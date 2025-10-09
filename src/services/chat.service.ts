import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage, ChatRequest, ChatResponse, Conversation } from '../models/chat.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private currentConversationSubject = new BehaviorSubject<Conversation | null>(null);

  public messages$ = this.messagesSubject.asObservable();
  public isConnected$ = this.isConnectedSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public currentConversation$ = this.currentConversationSubject.asObservable();

  private readonly SOCKET_URL = 'http://localhost:3040';

  constructor(private authService: AuthService) {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    // Get auth token and tenant ID from auth service
    const token = this.authService.getToken();
    const tenantId = this.authService.getTenantId();

    if (!token || !tenantId) {
      console.error('Authentication token or tenant ID not found');
      return;
    }

    this.socket = io(this.SOCKET_URL, {
      auth: {
        token,
        tenantId,
      },
      transports: ['websocket'],
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.isConnectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.isConnectedSubject.next(false);
    });

    this.socket.on('chat:response', (response: ChatResponse) => {
      this.handleChatResponse(response);
    });

    this.socket.on('chat:message', (message: ChatMessage) => {
      this.addMessage(message);
    });

    this.socket.on('chat:typing', (data: { userId: number; conversationId: string }) => {
      // Handle typing indicator
      console.log('User typing:', data);
    });

    this.socket.on('chat:stop_typing', (data: { userId: number; conversationId: string }) => {
      // Handle stop typing indicator
      console.log('User stopped typing:', data);
    });

    this.socket.on('chat:error', (error: { message: string; error: string }) => {
      console.error('Chat error:', error);
      this.isLoadingSubject.next(false);
    });
  }

  public sendMessage(message: string, conversationId?: string): void {
    if (!this.socket || !this.isConnectedSubject.value) {
      console.error('Socket not connected');
      return;
    }

    const chatRequest: ChatRequest = {
      message,
      conversationId,
      tenantId: this.getTenantId(),
      userId: this.getUserId(),
    };

    this.isLoadingSubject.next(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: this.generateMessageId(),
      conversationId: conversationId || 'temp',
      tenantId: this.getTenantId(),
      userId: this.getUserId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    this.addMessage(userMessage);

    // Send to server
    this.socket.emit('chat:message', chatRequest);
  }

  public joinConversation(conversationId: string): void {
    if (!this.socket) return;

    this.socket.emit('chat:join_conversation', { conversationId });
  }

  public leaveConversation(conversationId: string): void {
    if (!this.socket) return;

    this.socket.emit('chat:leave_conversation', { conversationId });
  }

  public startTyping(conversationId?: string): void {
    if (!this.socket) return;

    this.socket.emit('chat:typing', { conversationId });
  }

  public stopTyping(conversationId?: string): void {
    if (!this.socket) return;

    this.socket.emit('chat:stop_typing', { conversationId });
  }

  private handleChatResponse(response: ChatResponse): void {
    this.isLoadingSubject.next(false);

    const assistantMessage: ChatMessage = {
      id: this.generateMessageId(),
      conversationId: response.conversationId,
      tenantId: this.getTenantId(),
      userId: 0, // System/assistant user ID
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      metadata: {
        suggestions: response.suggestions,
        actions: response.actions,
      },
    };

    this.addMessage(assistantMessage);

    // Update current conversation if needed
    if (response.conversationId) {
      this.updateCurrentConversation(response.conversationId);
    }
  }

  private addMessage(message: ChatMessage): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, message]);
  }

  private updateCurrentConversation(conversationId: string): void {
    const currentConv = this.currentConversationSubject.value;
    if (!currentConv || currentConv.id !== conversationId) {
      // Create a new conversation object
      const conversation: Conversation = {
        id: conversationId,
        tenantId: this.getTenantId(),
        userId: this.getUserId(),
        title: 'New Conversation',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };
      this.currentConversationSubject.next(conversation);
    }
  }

  public clearMessages(): void {
    this.messagesSubject.next([]);
  }

  public createNewConversation(): void {
    this.clearMessages();
    this.currentConversationSubject.next(null);
  }

  private generateMessageId(): string {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getAuthToken(): string {
    // Implement your auth token retrieval logic
    // This could be from localStorage, a service, etc.
    return localStorage.getItem('authToken') || '';
  }

  private getTenantId(): string {
    // Implement your tenant ID retrieval logic
    return localStorage.getItem('tenantId') || 'default-tenant';
  }

  private getUserId(): number {
    // Implement your user ID retrieval logic
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 1;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
