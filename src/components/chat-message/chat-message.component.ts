import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage, ChatAction } from '../../models/chat.models';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="message"
      [ngClass]="{
        'user-message': message.role === 'user',
        'assistant-message': message.role === 'assistant'
      }"
    >
      <div class="message-content">
        <div class="message-header">
          <span class="message-role">{{ getRoleDisplayName(message.role) }}</span>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
        <div class="message-text" [innerHTML]="formatMessage(message.content)"></div>

        <!-- Suggestions -->
        <div *ngIf="message.metadata?.suggestions?.length" class="suggestions">
          <h4>Suggestions:</h4>
          <div class="suggestion-chips">
            <button
              *ngFor="let suggestion of message.metadata.suggestions"
              class="suggestion-chip"
              (click)="onSuggestionClick(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div *ngIf="message.metadata?.actions?.length" class="actions">
          <h4>Actions:</h4>
          <div class="action-buttons">
            <button
              *ngFor="let action of message.metadata.actions"
              class="action-button"
              (click)="onActionClick(action)"
            >
              {{ action.description }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .message {
        margin-bottom: 16px;
        padding: 12px;
        border-radius: 8px;
        max-width: 80%;
      }

      .user-message {
        background-color: #007bff;
        color: white;
        margin-left: auto;
      }

      .assistant-message {
        background-color: #f8f9fa;
        color: #333;
        border: 1px solid #e9ecef;
      }

      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 0.8em;
        opacity: 0.8;
      }

      .message-role {
        font-weight: bold;
        text-transform: capitalize;
      }

      .message-time {
        font-size: 0.75em;
      }

      .message-text {
        line-height: 1.4;
        word-wrap: break-word;
      }

      .suggestions,
      .actions {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }

      .suggestions h4,
      .actions h4 {
        margin: 0 0 8px 0;
        font-size: 0.9em;
        font-weight: 600;
      }

      .suggestion-chips,
      .action-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .suggestion-chip {
        background-color: rgba(0, 123, 255, 0.1);
        border: 1px solid rgba(0, 123, 255, 0.3);
        color: #007bff;
        padding: 4px 8px;
        border-radius: 16px;
        font-size: 0.8em;
        cursor: pointer;
        transition: all 0.2s;
      }

      .suggestion-chip:hover {
        background-color: rgba(0, 123, 255, 0.2);
      }

      .action-button {
        background-color: #28a745;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 0.8em;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .action-button:hover {
        background-color: #218838;
      }

      .user-message .suggestion-chip {
        background-color: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        color: white;
      }

      .user-message .suggestion-chip:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    `,
  ],
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;
  @Output() suggestionClick = new EventEmitter<string>();
  @Output() actionClick = new EventEmitter<ChatAction>();

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'user':
        return 'You';
      case 'assistant':
        return 'Assistant';
      case 'system':
        return 'System';
      default:
        return role;
    }
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatMessage(content: string): string {
    // Simple formatting - you can enhance this with markdown parsing
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  onSuggestionClick(suggestion: string): void {
    this.suggestionClick.emit(suggestion);
  }

  onActionClick(action: ChatAction): void {
    this.actionClick.emit(action);
  }
}
