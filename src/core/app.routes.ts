import { Routes } from '@angular/router';
import { LayoutComponent } from '../components/layout/layout/layout.component';
import { LoginComponent } from '../components/pages/login/login.component';
import { HomeComponent } from '../components/pages/home/home.component';
import { CrmDashboardComponent } from '../components/pages/crm-dashboard/crm-dashboard.component';
import { StudentsComponent } from '../components/pages/students/students-list/students.component';
import { StudentFormComponent } from '../components/pages/students/student-form/student-form.component';
import { StudentDetailComponent } from '../components/pages/students/student-detail/student-detail.component';
import { CoursesComponent } from '../components/pages/courses/courses-list/courses.component';
import { CourseFormComponent } from '../components/pages/courses/course-form/course-form.component';
import { CourseDetailComponent } from '../components/pages/courses/course-detail/course-detail.component';
import { ClassesComponent } from '../components/pages/classes/classes-list/classes.component';
import { ClassFormComponent } from '../components/pages/classes/class-form/class-form.component';
import { ClassDetailComponent } from '../components/pages/classes/class-detail/class-detail.component';
import { UsersComponent } from '../components/pages/users/users-list/users.component';
import { UserFormComponent } from '../components/pages/users/user-form/user-form.component';
import { ProductsComponent } from '../components/pages/products/products-list/products.component';
import { ProductFormComponent } from '../components/pages/products/product-form/product-form.component';
import { ProductDetailComponent } from '../components/pages/products/product-detail/product-detail.component';
import { OrdersListComponent } from '../components/pages/orders/orders-list/orders-list.component';
import { OrdersFormComponent } from '../components/pages/orders/orders-form/orders-form.component';
import { OrdersDetailComponent } from '../components/pages/orders/orders-detail/orders-detail.component';
import { PaymentsComponent } from '../components/pages/payments/payments-list/payments.component';
import { PaymentsFormComponent } from '../components/pages/payments/payments-form/payments-form.component';
import { PaymentsDetailComponent } from '../components/pages/payments/payments-detail/payments-detail.component';
import { RolesComponent } from '../components/pages/roles/roles-list/roles.component';
import { RolesFormComponent } from '../components/pages/roles/roles-form/roles-form.component';
import { RolesDetailComponent } from '../components/pages/roles/roles-detail/roles-detail.component';
import { SeasonsComponent } from '../components/pages/seasons/seasons-list/seasons.component';
import { SeasonsFormComponent } from '../components/pages/seasons/seasons-form/seasons-form.component';
import { SeasonsDetailComponent } from '../components/pages/seasons/seasons-detail/seasons-detail.component';
import { PermissionsComponent } from '../components/pages/permissions/permissions-list/permissions.component';
import { PermissionsFormComponent } from '../components/pages/permissions/permissions-form/permissions-form.component';
import { PermissionsDetailComponent } from '../components/pages/permissions/permissions-detail/permissions-detail.component';
import { CourseenrollmentsComponent } from '../components/pages/course-enrollments/course-enrollments-list/courseenrollments.component';
import { CourseenrollmentsFormComponent } from '../components/pages/course-enrollments/course-enrollments-form/course-enrollments-form.component';
import { CourseenrollmentsDetailComponent } from '../components/pages/course-enrollments/course-enrollments-detail/course-enrollments-detail.component';
import { StudentclassesComponent } from '../components/pages/student-classes/student-classes-list/studentclasses.component';
import { StudentclassesFormComponent } from '../components/pages/student-classes/student-classes-form/student-classes-form.component';
import { StudentclassesDetailComponent } from '../components/pages/student-classes/student-classes-detail/student-classes-detail.component';
import { OrderItemsComponent } from '../components/pages/order-items/order-items-list/orderitems.component';
import { OrderItemsFormComponent } from '../components/pages/order-items/order-items-form/order-items-form.component';
import { OrderItemsDetailComponent } from '../components/pages/order-items/order-items-detail/order-items-detail.component';
import { PaymentinstallmentsComponent } from '../components/pages/payment-installments/payment-installments-list/paymentinstallments.component';
import { PaymentinstallmentsFormComponent } from '../components/pages/payment-installments/payment-installments-form/payment-installments-form.component';
import { PaymentinstallmentsDetailComponent } from '../components/pages/payment-installments/payment-installments-detail/payment-installments-detail.component';
import { UserDetailComponent } from '../components/pages/users/user-detail/user-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent }, // canActivate: [AuthGuard] },
  
  // CRM Routes with Layout
  {
    path: 'crm',
    component: LayoutComponent,
    children: [
      { path: '', component: CrmDashboardComponent }, // canActivate: [AuthGuard] },
  
      // Student Routes
      { path: 'students', component: StudentsComponent }, // canActivate: [AuthGuard] },
      { path: 'students/new', component: StudentFormComponent }, // canActivate: [AuthGuard] },
      { path: 'students/:id', component: StudentDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'students/:id/edit', component: StudentFormComponent }, // canActivate: [AuthGuard] },
      
      // Course Routes
      { path: 'courses', component: CoursesComponent }, // canActivate: [AuthGuard] },
      { path: 'courses/new', component: CourseFormComponent }, // canActivate: [AuthGuard] },
      { path: 'courses/:id', component: CourseDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'courses/:id/edit', component: CourseFormComponent }, // canActivate: [AuthGuard] },
      
      // Class Routes
      { path: 'classes', component: ClassesComponent }, // canActivate: [AuthGuard] },
      { path: 'classes/new', component: ClassFormComponent }, // canActivate: [AuthGuard] },
      { path: 'classes/:id', component: ClassDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'classes/:id/edit', component: ClassFormComponent }, // canActivate: [AuthGuard] },

      // User Routes
      { path: 'users', component: UsersComponent }, // canActivate: [AuthGuard] },
      { path: 'users/new', component: UserFormComponent }, // canActivate: [AuthGuard] },
      { path: 'users/:id', component: UserDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'users/:id/edit', component: UserFormComponent }, // canActivate: [AuthGuard] },

      // Product Routes
      { path: 'products', component: ProductsComponent }, // canActivate: [AuthGuard] },
      { path: 'products/new', component: ProductFormComponent }, // canActivate: [AuthGuard] },
      { path: 'products/:id', component: ProductDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'products/:id/edit', component: ProductFormComponent }, // canActivate: [AuthGuard] },

      // Order Routes
      { path: 'orders', component: OrdersListComponent }, // canActivate: [AuthGuard] },
      { path: 'orders/new', component: OrdersFormComponent }, // canActivate: [AuthGuard] },
      { path: 'orders/:id', component: OrdersDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'orders/:id/edit', component: OrdersFormComponent }, // canActivate: [AuthGuard] },

      // Payment Routes
      { path: 'payments', component: PaymentsComponent }, // canActivate: [AuthGuard] },
      { path: 'payments/new', component: PaymentsFormComponent }, // canActivate: [AuthGuard] },
      { path: 'payments/:id', component: PaymentsDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'payments/:id/edit', component: PaymentsFormComponent }, // canActivate: [AuthGuard] },

      // Role Routes
      { path: 'roles', component: RolesComponent }, // canActivate: [AuthGuard] },
      { path: 'roles/new', component: RolesFormComponent }, // canActivate: [AuthGuard] },
      { path: 'roles/:id', component: RolesDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'roles/:id/edit', component: RolesFormComponent }, // canActivate: [AuthGuard] },

      // Season Routes
      { path: 'seasons', component: SeasonsComponent }, // canActivate: [AuthGuard] },
      { path: 'seasons/new', component: SeasonsFormComponent }, // canActivate: [AuthGuard] },
      { path: 'seasons/:id', component: SeasonsDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'seasons/:id/edit', component: SeasonsFormComponent }, // canActivate: [AuthGuard] },

      // Permission Routes
      { path: 'permissions', component: PermissionsComponent }, // canActivate: [AuthGuard] },
      { path: 'permissions/new', component: PermissionsFormComponent }, // canActivate: [AuthGuard] },
      { path: 'permissions/:id', component: PermissionsDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'permissions/:id/edit', component: PermissionsFormComponent }, // canActivate: [AuthGuard] },

      // Course Enrollment Routes
      { path: 'course-enrollments', component: CourseenrollmentsComponent }, // canActivate: [AuthGuard] },
      { path: 'course-enrollments/new', component: CourseenrollmentsFormComponent }, // canActivate: [AuthGuard] },
      { path: 'course-enrollments/:id', component: CourseenrollmentsDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'course-enrollments/:id/edit', component: CourseenrollmentsFormComponent }, // canActivate: [AuthGuard] },

      // Student Class Routes
      { path: 'student-classes', component: StudentclassesComponent }, // canActivate: [AuthGuard] },
      { path: 'student-classes/new', component: StudentclassesFormComponent }, // canActivate: [AuthGuard] },
      { path: 'student-classes/:id', component: StudentclassesDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'student-classes/:id/edit', component: StudentclassesFormComponent }, // canActivate: [AuthGuard] },

      // Order Item Routes
      { path: 'order-items', component: OrderItemsComponent }, // canActivate: [AuthGuard] },
      { path: 'order-items/new', component: OrderItemsFormComponent }, // canActivate: [AuthGuard] },
      { path: 'order-items/:id', component: OrderItemsDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'order-items/:id/edit', component: OrderItemsFormComponent }, // canActivate: [AuthGuard] },

      // Payment Installment Routes
      { path: 'payment-installments', component: PaymentinstallmentsComponent }, // canActivate: [AuthGuard] },
      { path: 'payment-installments/new', component: PaymentinstallmentsFormComponent }, // canActivate: [AuthGuard] },
      { path: 'payment-installments/:id', component: PaymentinstallmentsDetailComponent }, // canActivate: [AuthGuard] },
      { path: 'payment-installments/:id/edit', component: PaymentinstallmentsFormComponent }, // canActivate: [AuthGuard] },
    ]
  },

  { path: '**', redirectTo: '/home' }
];
