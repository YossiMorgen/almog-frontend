import { Component, Input, TemplateRef, ContentChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PermissionService } from '../../../services/permission.service';
import { PERMISSIONS } from '../../../config/permissions.config';
import { AsyncPipe, CommonModule, NgTemplateOutlet } from '@angular/common';

/**
 * Permission Wrapper Component
 * 
 * Conditionally renders content based on user permissions.
 * For admins, shows permission requirements as a tooltip.
 */
@Component({
  selector: 'app-permission-wrapper',
  standalone: true,
  imports: [AsyncPipe, NgTemplateOutlet, CommonModule],
  template: `
    <div 
      class="permission-wrapper"
      [class.has-permission]="hasPermission$ | async"
      [class.no-permission]="!(hasPermission$ | async)"
      [title]="tooltipText$ | async"
      [attr.data-permissions]="permissionsString">
      
      <!-- Content with permission -->
      <ng-container *ngIf="hasPermission$ | async">
        <ng-content></ng-content>
      </ng-container>
      
      <!-- Fallback content when no permission -->
      <ng-container *ngIf="!(hasPermission$ | async) && fallbackTemplate">
        <ng-container *ngTemplateOutlet="fallbackTemplate"></ng-container>
      </ng-container>
      
      <!-- Default fallback when no permission and no fallback template -->
      <ng-container *ngIf="!(hasPermission$ | async) && !fallbackTemplate && showFallback">
        <div class="permission-fallback">
          <span class="permission-icon">🔒</span>
          <span class="permission-text">{{ fallbackText }}</span>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .permission-wrapper {
      display: inline-block;
      position: relative;
    }
    
    .permission-wrapper.has-permission {
      opacity: 1;
    }
    
    .permission-wrapper.no-permission {
      opacity: 0.6;
    }
    
    .permission-fallback {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #6c757d;
    }
    
    .permission-icon {
      font-size: 0.75rem;
    }
    
    .permission-text {
      font-style: italic;
    }
    
    /* Tooltip styles for admin users */
    .permission-wrapper[title]:hover::after {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      white-space: pre-line;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .permission-wrapper[title]:hover::before {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      border: 5px solid transparent;
      border-top-color: #333;
      z-index: 1000;
    }
  `]
})
export class PermissionWrapperComponent implements OnInit {
  
  @Input() permissions!: string | string[] | readonly string[];
  @Input() requireAll: boolean = true;
  @Input() fallbackText: string = 'No permission';
  @Input() showFallback: boolean = true;
  @ContentChild('fallback', { static: false }) fallbackTemplate?: TemplateRef<any>;
  
  hasPermission$!: Observable<boolean>;
  tooltipText$!: Observable<string>;
  permissionsString!: string;

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    // Convert permissions to array if single string
    const permissionArray = Array.isArray(this.permissions) 
      ? this.permissions 
      : [this.permissions];
    
    this.permissionsString = permissionArray.join(', ');
    
    // Check permissions
    if (this.requireAll) {
      this.hasPermission$ = this.permissionService.hasAllPermissions(permissionArray as any);
    } else {
      this.hasPermission$ = this.permissionService.hasAnyPermission(permissionArray as any);
    }
    
    // Generate tooltip text for admins
    this.tooltipText$ = this.permissionService.isAdmin().pipe(
      map(isAdmin => {
        if (isAdmin) {
          const permissionNames = permissionArray.map(p => 
            this.permissionService.getPermissionDisplayName(p as any)
          ).join('\n');
          
          const logic = this.requireAll ? 'ALL' : 'ANY';
          return `Required Permissions (${logic}):\n${permissionNames}`;
        }
        return '';
      })
    );
  }
}
