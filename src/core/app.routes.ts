import { Routes } from '@angular/router';
import { AuthGuard, PermissionGuard, SignedInGuard, TenantGuard, requirePermissions, requireAnyPermission } from '../guards';
import { PERMISSIONS } from '../config/permissions.config';
import { TableFilterParams } from '../models/filter-schemas';
import { DEFAULT_ROUTE_FILTERS } from '../config/route-filters.config';

/**
 * Route Configuration with Filter Support
 * 
 * All list routes support query parameters for filtering:
 * - search: string - General search term
 * - page: number - Page number (default: 1)
 * - limit: number - Items per page (default: 10, max: 100)
 * - sortBy: string - Field to sort by
 * - sortOrder: 'asc' | 'desc' - Sort direction (default: 'asc')
 * - status: string - Filter by status
 * - Additional entity-specific filters as defined in filter-schemas.ts
 * 
 * Filter parameters are automatically parsed and validated using Zod schemas
 * and can be used with the TableFilterComponent for UI filtering.
 */
export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('../components/pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [SignedInGuard]
  },
  { 
    path: 'tenant-selection', 
    loadComponent: () => import('../components/pages/tanants/tenant-selection/tenant-selection.component').then(m => m.TenantSelectionComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'tenant-create', 
    loadComponent: () => import('../components/pages/tanants/tenant-create/tenant-create.component').then(m => m.TenantCreateComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'unauthorized', 
    loadComponent: () => import('../components/pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    canActivate: [AuthGuard, TenantGuard]
  },
  { 
    path: 'home', 
    loadComponent: () => import('../components/pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard, TenantGuard]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('../components/pages/crm-dashboard/crm-dashboard.component').then(m => m.CrmDashboardComponent),
    canActivate: [AuthGuard, TenantGuard]
  },
  
  // CRM Routes with Layout
  {
    path: 'crm',
    loadComponent: () => import('../components/layout/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [TenantGuard, AuthGuard],
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.STUDENTS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['students'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['students'].filterType
        }
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
        loadComponent: () => import('../components/pages/courses/courses-wrapper/courses-wrapper.component').then(m => m.CoursesWrapperComponent),
        canActivate: [PermissionGuard],
        data: { 
          permissions: requirePermissions([PERMISSIONS.COURSES.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['courses'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['courses'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.CLASSES.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['classes'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['classes'].filterType
        }
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

      // Classes Locations Routes
      { 
        path: 'classes-locations', 
        loadComponent: () => import('../components/pages/classes-locations/classes-locations-list/classes-locations-list.component').then(m => m.ClassesLocationsListComponent),
        canActivate: [PermissionGuard],
        data: { 
          permissions: requirePermissions([PERMISSIONS.CLASSES_LOCATIONS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['classes-locations'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['classes-locations'].filterType
        }
      },
      { 
        path: 'classes-locations/new', 
        loadComponent: () => import('../components/pages/classes-locations/classes-locations-form/classes-locations-form.component').then(m => m.ClassesLocationsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES_LOCATIONS.CREATE]) }
      },
      { 
        path: 'classes-locations/:id', 
        loadComponent: () => import('../components/pages/classes-locations/classes-locations-detail/classes-locations-detail.component').then(m => m.ClassesLocationsDetailComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES_LOCATIONS.READ]) }
      },
      { 
        path: 'classes-locations/:id/edit', 
        loadComponent: () => import('../components/pages/classes-locations/classes-locations-form/classes-locations-form.component').then(m => m.ClassesLocationsFormComponent),
        canActivate: [PermissionGuard],
        data: { permissions: requirePermissions([PERMISSIONS.CLASSES_LOCATIONS.UPDATE]) }
      },

      // User Routes (Admin only - requires multiple permissions)
      { 
        path: 'users', 
        loadComponent: () => import('../components/pages/users/users-list/users.component').then(m => m.UsersComponent),
        canActivate: [PermissionGuard],
        data: { 
          permissions: requirePermissions([PERMISSIONS.USERS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['users'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['users'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.PRODUCTS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['products'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['products'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.ORDERS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['orders'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['orders'].filterType
        }
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
        data: { 
          permissions: requireAnyPermission([PERMISSIONS.PAYMENTS.READ, PERMISSIONS.USERS.MANAGE_ROLES]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['payments'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['payments'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['roles'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['roles'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.SEASONS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['seasons'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['seasons'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.USERS.MANAGE_ROLES]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['permissions'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['permissions'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.COURSES.MANAGE_ENROLLMENTS]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['course-enrollments'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['course-enrollments'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.CLASSES.MARK_ATTENDANCE]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['student-classes'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['student-classes'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.ORDERS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['order-items'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['order-items'].filterType
        }
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
        data: { 
          permissions: requirePermissions([PERMISSIONS.PAYMENTS.READ]),
          defaultFilters: DEFAULT_ROUTE_FILTERS['payment-installments'].defaultFilters,
          filterType: DEFAULT_ROUTE_FILTERS['payment-installments'].filterType
        }
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
