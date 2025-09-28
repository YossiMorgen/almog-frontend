import { Component } from '@angular/core';
import { PERMISSIONS, COMMON_PATTERNS } from '../../../config/permissions.config';
import { PermissionWrapperComponent } from '../../shared/permission-wrapper/permission-wrapper.component';

/**
 * Example component demonstrating the PermissionWrapperComponent usage
 */
@Component({
  selector: 'app-permission-wrapper-example',
  imports: [PermissionWrapperComponent],
  template: `
    <div class="permission-examples">
      <h2>Permission Wrapper Examples</h2>
      
      <!-- Basic Permission Check -->
      <div class="example-section">
        <h3>Basic Permission Check</h3>
        <app-permission-wrapper [permissions]="PERMISSIONS.STUDENTS.CREATE">
          <button class="btn btn-primary">Create Student</button>
        </app-permission-wrapper>
      </div>
      
      <!-- Multiple Permissions (All Required) -->
      <div class="example-section">
        <h3>Multiple Permissions (All Required)</h3>
        <app-permission-wrapper 
          [permissions]="[PERMISSIONS.USERS.READ, PERMISSIONS.USERS.MANAGE_ROLES]" 
          [requireAll]="true">
          <button class="btn btn-warning">Admin Panel</button>
        </app-permission-wrapper>
      </div>
      
      <!-- Multiple Permissions (Any Required) -->
      <div class="example-section">
        <h3>Multiple Permissions (Any Required)</h3>
        <app-permission-wrapper 
          [permissions]="COMMON_PATTERNS.PAYMENT_OR_ADMIN" 
          [requireAll]="false">
          <button class="btn btn-info">View Payments</button>
        </app-permission-wrapper>
      </div>
      
      <!-- With Custom Fallback Text -->
      <div class="example-section">
        <h3>Custom Fallback Text</h3>
        <app-permission-wrapper 
          [permissions]="PERMISSIONS.CLASSES.MARK_ATTENDANCE"
          fallbackText="Instructor access required">
          <button class="btn btn-success">Mark Attendance</button>
        </app-permission-wrapper>
      </div>
      
      <!-- With Custom Fallback Template -->
      <div class="example-section">
        <h3>Custom Fallback Template</h3>
        <app-permission-wrapper [permissions]="PERMISSIONS.USERS.MANAGE_ROLES">
          <button class="btn btn-danger">Delete User</button>
          
          <ng-template #fallback>
            <div class="custom-fallback">
              <span class="icon">👑</span>
              <span>Super Admin Only</span>
            </div>
          </ng-template>
        </app-permission-wrapper>
      </div>
      
      <!-- Without Fallback -->
      <div class="example-section">
        <h3>No Fallback Display</h3>
        <app-permission-wrapper 
          [permissions]="PERMISSIONS.PRODUCTS.DELETE"
          [showFallback]="false">
          <button class="btn btn-outline-danger">Delete Product</button>
        </app-permission-wrapper>
      </div>
      
      <!-- Complex Content -->
      <div class="example-section">
        <h3>Complex Content</h3>
        <app-permission-wrapper [permissions]="PERMISSIONS.COURSES.MANAGE_ENROLLMENTS">
          <div class="card">
            <div class="card-header">
              <h4>Course Enrollment Management</h4>
            </div>
            <div class="card-body">
              <p>Manage student enrollments in courses.</p>
              <div class="btn-group">
                <button class="btn btn-primary">Enroll Student</button>
                <button class="btn btn-secondary">View Enrollments</button>
                <button class="btn btn-warning">Update Enrollment</button>
              </div>
            </div>
          </div>
        </app-permission-wrapper>
      </div>
      
      <!-- Navigation Menu Items -->
      <div class="example-section">
        <h3>Navigation Menu</h3>
        <nav class="nav nav-pills">
          <app-permission-wrapper [permissions]="PERMISSIONS.STUDENTS.READ">
            <a class="nav-link" href="#">Students</a>
          </app-permission-wrapper>
          
          <app-permission-wrapper [permissions]="PERMISSIONS.COURSES.READ">
            <a class="nav-link" href="#">Courses</a>
          </app-permission-wrapper>
          
          <app-permission-wrapper [permissions]="PERMISSIONS.PAYMENTS.READ">
            <a class="nav-link" href="#">Payments</a>
          </app-permission-wrapper>
          
          <app-permission-wrapper [permissions]="PERMISSIONS.USERS.READ">
            <a class="nav-link" href="#">Users</a>
          </app-permission-wrapper>
        </nav>
      </div>
      
      <!-- Form Fields -->
      <div class="example-section">
        <h3>Form Fields</h3>
        <form>
          <div class="form-group">
            <label>Student Name</label>
            <input type="text" class="form-control" placeholder="Enter student name">
          </div>
          
          <app-permission-wrapper [permissions]="PERMISSIONS.STUDENTS.UPDATE">
            <div class="form-group">
              <label>Advanced Settings</label>
              <input type="text" class="form-control" placeholder="Advanced configuration">
            </div>
          </app-permission-wrapper>
          
          <app-permission-wrapper [permissions]="PERMISSIONS.STUDENTS.CREATE">
            <button type="submit" class="btn btn-primary">Create Student</button>
          </app-permission-wrapper>
        </form>
      </div>
      
      <!-- Table Actions -->
      <div class="example-section">
        <h3>Table Row Actions</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td>
                <div class="btn-group">
                  <app-permission-wrapper [permissions]="PERMISSIONS.STUDENTS.READ">
                    <button class="btn btn-sm btn-outline-primary">View</button>
                  </app-permission-wrapper>
                  
                  <app-permission-wrapper [permissions]="PERMISSIONS.STUDENTS.UPDATE">
                    <button class="btn btn-sm btn-outline-warning">Edit</button>
                  </app-permission-wrapper>
                  
                  <app-permission-wrapper [permissions]="PERMISSIONS.STUDENTS.DELETE">
                    <button class="btn btn-sm btn-outline-danger">Delete</button>
                  </app-permission-wrapper>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .permission-examples {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .example-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    
    .example-section h3 {
      margin-top: 0;
      color: #495057;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
    
    .custom-fallback {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #856404;
    }
    
    .custom-fallback .icon {
      font-size: 1rem;
    }
    
    .card {
      border: 1px solid #dee2e6;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    
    .card-header {
      background-color: #e9ecef;
      padding: 15px;
      border-bottom: 1px solid #dee2e6;
    }
    
    .card-body {
      padding: 15px;
    }
    
    .btn-group {
      display: inline-flex;
      gap: 5px;
    }
    
    .nav {
      display: flex;
      gap: 10px;
    }
    
    .nav-link {
      padding: 8px 16px;
      text-decoration: none;
      border-radius: 4px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
    }
    
    .nav-link:hover {
      background-color: #e9ecef;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-control {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
    }
    
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .table th,
    .table td {
      padding: 12px;
      border: 1px solid #dee2e6;
      text-align: left;
    }
    
    .table th {
      background-color: #e9ecef;
      font-weight: bold;
    }
    
    .btn {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-success { background-color: #28a745; color: white; }
    .btn-warning { background-color: #ffc107; color: black; }
    .btn-danger { background-color: #dc3545; color: white; }
    .btn-info { background-color: #17a2b8; color: white; }
    
    .btn-outline-primary { background-color: transparent; color: #007bff; border: 1px solid #007bff; }
    .btn-outline-warning { background-color: transparent; color: #ffc107; border: 1px solid #ffc107; }
    .btn-outline-danger { background-color: transparent; color: #dc3545; border: 1px solid #dc3545; }
    
    .btn-sm {
      padding: 4px 8px;
      font-size: 0.875rem;
    }
  `]
})
export class PermissionWrapperExampleComponent {
  
  // Expose constants to template
  PERMISSIONS = PERMISSIONS;
  COMMON_PATTERNS = COMMON_PATTERNS;
}
