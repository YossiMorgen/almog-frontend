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
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Inject } from '@angular/core';

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
    MatExpansionModule,
    MatDialogModule
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
    private snackBar: MatSnackBar,
    private dialog: MatDialog
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

  async autoCreateMCPKey(): Promise<void> {
    this.creatingApiKey = true;
    try {
      const modelName = this.getModelName();
      const keyName = `${modelName}-key`;
      
      const request: CreateApiKeyRequest = {
        key_name: keyName,
        is_active: true
      };
      
      const newApiKey = await this.apiKeysService.createApiKey(request).toPromise();
      
      if (newApiKey) {
        this.apiKeys.unshift(newApiKey);
        this.showSuccess('MCP API key created successfully');
        
        if (newApiKey.api_key) {
          this.showMCPConfigDialog(newApiKey);
        }
      }
    } catch (error) {
      console.error('Error creating MCP API key:', error);
      this.showError('Failed to create MCP API key');
    } finally {
      this.creatingApiKey = false;
    }
  }

  private getModelName(): string {
    const currentUrl = window.location.hostname;
    const tenantMatch = currentUrl.match(/^([^.]+)/);
    return tenantMatch ? tenantMatch[1] : 'almog';
  }

  private showMCPConfigDialog(apiKey: ApiKey): void {
    const mcpConfig = this.generateMCPConfig(apiKey);
    
    const dialogRef = this.dialog.open(MCPConfigDialogComponent, {
      width: '600px',
      data: { apiKey, mcpConfig }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'copy') {
        this.copyToClipboard(mcpConfig);
      }
    });
  }

  private generateMCPConfig(apiKey: ApiKey): string {
    const baseUrl = 'http://localhost:3040';
    const modelName = this.getModelName();
    
    return `{
  "mcpServers": {
    "${modelName}-swimming-school": {
      "command": "node",
      "args": ["C:\\\\Users\\\\Yossi\\\\Desktop\\\\Projects\\\\Almog\\\\mcp-server\\\\server.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_USER": "postgres",
        "DB_PASSWORD": "oNyXh~A+}>50[Bz",
        "DB_NAME": "almog_crm_ai",
        "API_KEY": "${apiKey.api_key}",
        "API_BASE_URL": "${baseUrl}"
      }
    }
  }
}`;
  }
}

@Component({
  selector: 'app-mcp-config-dialog',
  template: `
    <h2 mat-dialog-title i18n="@@profile.apiKeys.mcpConfig.title">MCP Configuration for Claude Desktop</h2>
    <mat-dialog-content>
      <p i18n="@@profile.apiKeys.mcpConfig.description">
        Copy the configuration below and add it to your Claude Desktop configuration file.
      </p>
      
      <div class="config-container">
        <pre class="config-code">{{ mcpConfig }}</pre>
      </div>
      
      <div class="api-key-info">
        <h4 i18n="@@profile.apiKeys.mcpConfig.apiKeyTitle">Your API Key:</h4>
        <div class="api-key-display">
          <code>{{ apiKey.api_key }}</code>
          <button mat-icon-button (click)="copyApiKey()" matTooltip="Copy API Key">
            <mat-icon>content_copy</mat-icon>
          </button>
        </div>
      </div>
      
      <div class="instructions">
        <h4 i18n="@@profile.apiKeys.mcpConfig.instructionsTitle">Instructions:</h4>
        <ol>
          <li i18n="@@profile.apiKeys.mcpConfig.step1">Open Claude Desktop</li>
          <li i18n="@@profile.apiKeys.mcpConfig.step2">Go to Settings → Developer</li>
          <li i18n="@@profile.apiKeys.mcpConfig.step3">Add the configuration above to your MCP servers</li>
          <li i18n="@@profile.apiKeys.mcpConfig.step4">Restart Claude Desktop</li>
        </ol>
      </div>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()" i18n="@@profile.apiKeys.mcpConfig.close">Close</button>
      <button mat-raised-button color="primary" (click)="copyConfig()" i18n="@@profile.apiKeys.mcpConfig.copyConfig">Copy Configuration</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .config-container {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 16px;
      margin: 16px 0;
      overflow-x: auto;
    }
    
    .config-code {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      margin: 0;
      white-space: pre-wrap;
    }
    
    .api-key-info {
      margin: 16px 0;
    }
    
    .api-key-display {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f0f0f0;
      padding: 8px;
      border-radius: 4px;
    }
    
    .api-key-display code {
      flex: 1;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      word-break: break-all;
    }
    
    .instructions {
      margin: 16px 0;
    }
    
    .instructions ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .instructions li {
      margin: 4px 0;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class MCPConfigDialogComponent {
  apiKey: ApiKey;
  mcpConfig: string;

  constructor(
    public dialogRef: MatDialogRef<MCPConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.apiKey = data.apiKey;
    this.mcpConfig = data.mcpConfig;
  }

  copyConfig(): void {
    navigator.clipboard.writeText(this.mcpConfig).then(() => {
      this.snackBar.open('Configuration copied to clipboard', 'Close', {
        duration: 3000
      });
      this.dialogRef.close('copy');
    }).catch(() => {
      this.snackBar.open('Failed to copy configuration', 'Close', {
        duration: 3000
      });
    });
  }

  copyApiKey(): void {
    navigator.clipboard.writeText(this.apiKey.api_key!).then(() => {
      this.snackBar.open('API key copied to clipboard', 'Close', {
        duration: 3000
      });
    }).catch(() => {
      this.snackBar.open('Failed to copy API key', 'Close', {
        duration: 3000
      });
    });
  }
}
