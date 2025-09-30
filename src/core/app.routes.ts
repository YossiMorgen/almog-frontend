import { Routes } from '@angular/router';
import { AuthGuard, PermissionGuard, SignedInGuard, requirePermissions, requireAnyPermission } from '../guards';
import { PERMISSIONS } from '../config/permissions.config';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('../components/pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [SignedInGuard]
  },
  { 
    path: 'tenant-selection', 
    loadComponent: () => import('../app/pages/tenant-selection/tenant-selection.component').then(m => m.TenantSelectionComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'unauthorized', 
    loadComponent: () => import('../components/pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  { 
    path: 'home', 
    loadComponent: () => import('../components/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  
  // CRM Routes with Layout
  {
    path: 'crm',
    loadComponent: () => import('../components/layout/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { 
        path: 'profile', 
        loadComponent: () => import('../components/pages/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [AuthGuard]
      },
      { 
        path: '', 
        loadComponent: () => import('../components/pages/crm-dashboard/crm-dashboard.component').then(m => m.CrmDashboardComponent),
        canActivate: [AuthGuard]
      },
  
      // Student Routes
      { 
        path: 'students', 
        loadComponent: () => import('../components/pages/students/students-list/students.component').then(m => m.StudentsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.STUDENTS.READ]) }
      },
      { 
        path: 'students/new', 
        loadComponent: () => import('../components/pages/students/student-form/student-form.component').then(m => m.StudentFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.STUDENTS.CREATE]) }
      },
      { 
        path: 'students/:id', 
        loadComponent: () => import('../components/pages/students/student-detail/student-detail.component').then(m => m.StudentDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.STUDENTS.READ]) }
      },
      { 
        path: 'students/:id/edit', 
        loadComponent: () => import('../components/pages/students/student-form/student-form.component').then(m => m.StudentFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.STUDENTS.UPDATE]) }
      },
      
      // Course Routes
      { 
        path: 'courses', 
        loadComponent: () => import('../components/pages/courses/courses-list/courses.component').then(m => m.CoursesComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.READ]) }
      },
      { 
        path: 'courses/new', 
        loadComponent: () => import('../components/pages/courses/course-form/course-form.component').then(m => m.CourseFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.CREATE]) }
      },
      { 
        path: 'courses/:id', 
        loadComponent: () => import('../components/pages/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.READ]) }
      },
      { 
        path: 'courses/:id/edit', 
        loadComponent: () => import('../components/pages/courses/course-form/course-form.component').then(m => m.CourseFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.UPDATE]) }
      },
      
      // Class Routes
      { 
        path: 'classes', 
        loadComponent: () => import('../components/pages/classes/classes-list/classes.component').then(m => m.ClassesComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.READ]) }
      },
      { 
        path: 'classes/new', 
        loadComponent: () => import('../components/pages/classes/class-form/class-form.component').then(m => m.ClassFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.CREATE]) }
      },
      { 
        path: 'classes/:id', 
        loadComponent: () => import('../components/pages/classes/class-detail/class-detail.component').then(m => m.ClassDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.READ]) }
      },
      { 
        path: 'classes/:id/edit', 
        loadComponent: () => import('../components/pages/classes/class-form/class-form.component').then(m => m.ClassFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.UPDATE]) }
      },

      // User Routes (Admin only - requires multiple permissions)
      { 
        path: 'users', 
        loadComponent: () => import('../components/pages/users/users-list/users.component').then(m => m.UsersComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.READ]) }
      },
      { 
        path: 'users/new', 
        loadComponent: () => import('../components/pages/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.CREATE]) }
      },
      { 
        path: 'users/:id', 
        loadComponent: () => import('../components/pages/users/user-detail/user-detail.component').then(m => m.UserDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.READ]) }
      },
      { 
        path: 'users/:id/edit', 
        loadComponent: () => import('../components/pages/users/user-form/user-form.component').then(m => m.UserFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.UPDATE]) }
      },

      // Product Routes
      { 
        path: 'products', 
        loadComponent: () => import('../components/pages/products/products-list/products.component').then(m => m.ProductsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PRODUCTS.READ]) }
      },
      { 
        path: 'products/new', 
        loadComponent: () => import('../components/pages/products/product-form/product-form.component').then(m => m.ProductFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PRODUCTS.CREATE]) }
      },
      { 
        path: 'products/:id', 
        loadComponent: () => import('../components/pages/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PRODUCTS.READ]) }
      },
      { 
        path: 'products/:id/edit', 
        loadComponent: () => import('../components/pages/products/product-form/product-form.component').then(m => m.ProductFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PRODUCTS.UPDATE]) }
      },

      // Order Routes
      { 
        path: 'orders', 
        loadComponent: () => import('../components/pages/orders/orders-list/orders-list.component').then(m => m.OrdersListComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.READ]) }
      },
      { 
        path: 'orders/new', 
        loadComponent: () => import('../components/pages/orders/orders-form/orders-form.component').then(m => m.OrdersFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.CREATE]) }
      },
      { 
        path: 'orders/:id', 
        loadComponent: () => import('../components/pages/orders/orders-detail/orders-detail.component').then(m => m.OrdersDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.READ]) }
      },
      { 
        path: 'orders/:id/edit', 
        loadComponent: () => import('../components/pages/orders/orders-form/orders-form.component').then(m => m.OrdersFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.UPDATE]) }
      },

      // Payment Routes (Accountant or Admin can access)
      { 
        path: 'payments', 
        loadComponent: () => import('../components/pages/payments/payments-list/payments.component').then(m => m.PaymentsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requireAnyPermission([PERMISSIONS.PAYMENTS.READ, PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      { 
        path: 'payments/new', 
        loadComponent: () => import('../components/pages/payments/payments-form/payments-form.component').then(m => m.PaymentsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PAYMENTS.CREATE]) }
      },
      { 
        path: 'payments/:id', 
        loadComponent: () => import('../components/pages/payments/payments-detail/payments-detail.component').then(m => m.PaymentsDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requireAnyPermission([PERMISSIONS.PAYMENTS.READ, PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      { 
        path: 'payments/:id/edit', 
        loadComponent: () => import('../components/pages/payments/payments-form/payments-form.component').then(m => m.PaymentsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PAYMENTS.UPDATE]) }
      },

      // Role Routes (Admin only)
      { 
        path: 'roles', 
        loadComponent: () => import('../components/pages/roles/roles-list/roles.component').then(m => m.RolesComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      { 
        path: 'roles/new', 
        loadComponent: () => import('../components/pages/roles/roles-form/roles-form.component').then(m => m.RolesFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      { 
        path: 'roles/:id', 
        loadComponent: () => import('../components/pages/roles/roles-detail/roles-detail.component').then(m => m.RolesDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      { 
        path: 'roles/:id/edit', 
        loadComponent: () => import('../components/pages/roles/roles-form/roles-form.component').then(m => m.RolesFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },

      // Season Routes
      { 
        path: 'seasons', 
        loadComponent: () => import('../components/pages/seasons/seasons-list/seasons.component').then(m => m.SeasonsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.SEASONS.READ]) }
      },
      { 
        path: 'seasons/new', 
        loadComponent: () => import('../components/pages/seasons/seasons-form/seasons-form.component').then(m => m.SeasonsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.SEASONS.CREATE]) }
      },
      { 
        path: 'seasons/:id', 
        loadComponent: () => import('../components/pages/seasons/seasons-detail/seasons-detail.component').then(m => m.SeasonsDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.SEASONS.READ]) }
      },
      { 
        path: 'seasons/:id/edit', 
        loadComponent: () => import('../components/pages/seasons/seasons-form/seasons-form.component').then(m => m.SeasonsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.SEASONS.UPDATE]) }
      },

      // Permission Routes (Super Admin only)
      { 
        path: 'permissions', 
        loadComponent: () => import('../components/pages/permissions/permissions-list/permissions.component').then(m => m.PermissionsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      {
        path: 'permissions/new', 
        loadComponent: () => import('../components/pages/permissions/permissions-form/permissions-form.component').then(m => m.PermissionsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      { 
        path: 'permissions/:id', 
        loadComponent: () => import('../components/pages/permissions/permissions-detail/permissions-detail.component').then(m => m.PermissionsDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },
      { 
        path: 'permissions/:id/edit', 
        loadComponent: () => import('../components/pages/permissions/permissions-form/permissions-form.component').then(m => m.PermissionsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]) }
      },

      // Course Enrollment Routes
      { 
        path: 'course-enrollments', 
        loadComponent: () => import('../components/pages/course-enrollments/course-enrollments-list/courseenrollments.component').then(m => m.CourseenrollmentsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.MANAGE_ENROLLMENTS]) }
      },
      { 
        path: 'course-enrollments/new', 
        loadComponent: () => import('../components/pages/course-enrollments/course-enrollments-form/course-enrollments-form.component').then(m => m.CourseenrollmentsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.MANAGE_ENROLLMENTS]) }
      },
      { 
        path: 'course-enrollments/:id', 
        loadComponent: () => import('../components/pages/course-enrollments/course-enrollments-detail/course-enrollments-detail.component').then(m => m.CourseenrollmentsDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.MANAGE_ENROLLMENTS]) }
      },
      { 
        path: 'course-enrollments/:id/edit', 
        loadComponent: () => import('../components/pages/course-enrollments/course-enrollments-form/course-enrollments-form.component').then(m => m.CourseenrollmentsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.COURSES.MANAGE_ENROLLMENTS]) }
      },

      // Student Class Routes (Attendance Management)
      { 
        path: 'student-classes', 
        loadComponent: () => import('../components/pages/student-classes/student-classes-list/studentclasses.component').then(m => m.StudentclassesComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.MARK_ATTENDANCE]) }
      },
      { 
        path: 'student-classes/new', 
        loadComponent: () => import('../components/pages/student-classes/student-classes-form/student-classes-form.component').then(m => m.StudentclassesFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.MARK_ATTENDANCE]) }
      },
      { 
        path: 'student-classes/:id', 
        loadComponent: () => import('../components/pages/student-classes/student-classes-detail/student-classes-detail.component').then(m => m.StudentclassesDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.MARK_ATTENDANCE]) }
      },
      { 
        path: 'student-classes/:id/edit', 
        loadComponent: () => import('../components/pages/student-classes/student-classes-form/student-classes-form.component').then(m => m.StudentclassesFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES.MARK_ATTENDANCE]) }
      },

      // Order Item Routes
      { 
        path: 'order-items', 
        loadComponent: () => import('../components/pages/order-items/order-items-list/orderitems.component').then(m => m.OrderItemsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.READ]) }
      },
      { 
        path: 'order-items/new', 
        loadComponent: () => import('../components/pages/order-items/order-items-form/order-items-form.component').then(m => m.OrderItemsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.CREATE]) }
      },
      { 
        path: 'order-items/:id', 
        loadComponent: () => import('../components/pages/order-items/order-items-detail/order-items-detail.component').then(m => m.OrderItemsDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.READ]) }
      },
      { 
        path: 'order-items/:id/edit', 
        loadComponent: () => import('../components/pages/order-items/order-items-form/order-items-form.component').then(m => m.OrderItemsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.ORDERS.UPDATE]) }
      },

      // Payment Installment Routes
      { 
        path: 'payment-installments', 
        loadComponent: () => import('../components/pages/payment-installments/payment-installments-list/paymentinstallments.component').then(m => m.PaymentinstallmentsComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PAYMENTS.READ]) }
      },
      { 
        path: 'payment-installments/new', 
        loadComponent: () => import('../components/pages/payment-installments/payment-installments-form/payment-installments-form.component').then(m => m.PaymentinstallmentsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PAYMENTS.CREATE]) }
      },
      { 
        path: 'payment-installments/:id', 
        loadComponent: () => import('../components/pages/payment-installments/payment-installments-detail/payment-installments-detail.component').then(m => m.PaymentinstallmentsDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PAYMENTS.READ]) }
      },
      { 
        path: 'payment-installments/:id/edit', 
        loadComponent: () => import('../components/pages/payment-installments/payment-installments-form/payment-installments-form.component').then(m => m.PaymentinstallmentsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.PAYMENTS.UPDATE]) }
      },
    ]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: '**', redirectTo: '/home' }
];
