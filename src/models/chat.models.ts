// Chat System Types and Interfaces for Angular Frontend

export interface ChatMessage {
  id: string;
  conversationId: string;
  tenantId: string;
  userId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    suggestions?: string[];
    actions?: ChatAction[];
    [key: string]: any;
  };
}

export interface Conversation {
  id: string;
  tenantId: string;
  userId: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  context?: ConversationContext;
}

export interface ConversationContext {
  studentId?: number;
  courseId?: number;
  paymentId?: number;
  lastAction?: string;
  preferences?: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: ConversationContext;
  tenantId: string;
  userId: number;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  suggestions?: string[];
  actions?: ChatAction[];
  metadata?: Record<string, any>;
}

export interface ChatAction {
  type: 'create_student' | 'enroll_course' | 'send_email' | 'generate_report';
  parameters: Record<string, any>;
  description: string;
}

export interface TypingIndicator {
  userId: number;
  conversationId: string;
  isTyping: boolean;
}

export interface ChatError {
  message: string;
  error: string;
}
