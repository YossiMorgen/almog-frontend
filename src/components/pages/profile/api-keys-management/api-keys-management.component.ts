import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil } from 'rxjs';

import { ApiKeysService, ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest } from '../../../../services';

@Component({
  selector: 'app-api-keys-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  templateUrl: './api-keys-management.component.html',
  styleUrls: ['./api-keys-management.component.scss']
})
export class ApiKeysManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // API Keys
  apiKeys: ApiKey[] = [];
  loadingApiKeys = false;
  creatingApiKey = false;
  apiKeyForm: FormGroup;
  
  constructor(
    private apiKeysService: ApiKeysService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.apiKeyForm = this.formBuilder.group({
      key_name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }
  
  ngOnInit(): void {
    this.loadApiKeys();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  async loadApiKeys(): Promise<void> {
    this.loadingApiKeys = true;
    try {
      this.apiKeys = await this.apiKeysService.getApiKeys().toPromise() || [];
    } catch (error) {
      console.error('Error loading API keys:', error);
      this.showError('Failed to load API keys');
    } finally {
      this.loadingApiKeys = false;
    }
  }
  
  async createApiKey(): Promise<void> {
    if (this.apiKeyForm.invalid) return;
    
    this.creatingApiKey = true;
    try {
      const formData = this.apiKeyForm.value;
      const request: CreateApiKeyRequest = {
        key_name: formData.key_name,
        is_active: true
      };
      
      const newApiKey = await this.apiKeysService.createApiKey(request).toPromise();
      
      if (newApiKey) {
        this.apiKeys.unshift(newApiKey);
        this.apiKeyForm.reset();
        this.showSuccess('API key created successfully');
        
        // Show the full API key to the user (only shown once)
        if (newApiKey.api_key) {
          this.showApiKeyDialog(newApiKey);
        }
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      this.showError('Failed to create API key');
    } finally {
      this.creatingApiKey = false;
    }
  }
  
  async updateApiKey(apiKey: ApiKey): Promise<void> {
    if (!apiKey.id) return;
    
    try {
      const request: UpdateApiKeyRequest = {
        key_name: apiKey.key_name,
        is_active: apiKey.is_active
      };
      
      const updatedApiKey = await this.apiKeysService.updateApiKey(apiKey.id, request).toPromise();
      
      if (updatedApiKey) {
        const index = this.apiKeys.findIndex(key => key.id === apiKey.id);
        if (index !== -1) {
          this.apiKeys[index] = updatedApiKey;
        }
        this.showSuccess('API key updated successfully');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
      this.showError('Failed to update API key');
    }
  }
  
  async deleteApiKey(apiKey: ApiKey): Promise<void> {
    if (!apiKey.id) return;
    
    const confirmed = confirm(`Are you sure you want to delete the API key "${apiKey.key_name}"? This action cannot be undone.`);
    if (!confirmed) return;
    
    try {
      await this.apiKeysService.deleteApiKey(apiKey.id).toPromise();
      
      this.apiKeys = this.apiKeys.filter(key => key.id !== apiKey.id);
      this.showSuccess('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      this.showError('Failed to delete API key');
    }
  }
  
  async regenerateApiKey(apiKey: ApiKey): Promise<void> {
    if (!apiKey.id) return;
    
    const confirmed = confirm(`Are you sure you want to regenerate the API key "${apiKey.key_name}"? The old key will become invalid immediately.`);
    if (!confirmed) return;
    
    try {
      const regeneratedApiKey = await this.apiKeysService.regenerateApiKey(apiKey.id).toPromise();
      
      if (regeneratedApiKey) {
        const index = this.apiKeys.findIndex(key => key.id === apiKey.id);
        if (index !== -1) {
          this.apiKeys[index] = regeneratedApiKey;
        }
        this.showSuccess('API key regenerated successfully');
        
        // Show the new API key to the user (only shown once)
        if (regeneratedApiKey.api_key) {
          this.showApiKeyDialog(regeneratedApiKey);
        }
      }
    } catch (error) {
      console.error('Error regenerating API key:', error);
      this.showError('Failed to regenerate API key');
    }
  }
  
  private showApiKeyDialog(apiKey: ApiKey): void {
    // For now, we'll use a simple alert. In a real app, you'd create a proper dialog component
    const message = `Your new API key is:\n\n${apiKey.api_key}\n\nPlease copy and store it securely. You won't be able to see it again.`;
    
    if (confirm(message + '\n\nClick OK to copy to clipboard.')) {
      this.copyToClipboard(apiKey.api_key!);
    }
  }
  
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copied to clipboard');
    }).catch(() => {
      this.showError('Failed to copy to clipboard');
    });
  }
  
  toggleApiKeyStatus(apiKey: ApiKey): void {
    const updatedApiKey = { ...apiKey, is_active: !apiKey.is_active };
    this.updateApiKey(updatedApiKey);
  }
  
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }
  
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
