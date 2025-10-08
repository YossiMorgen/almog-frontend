import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { TableFilterParams, FilterField } from '../models/filter-schemas';
import { UsersService } from './users.service';
import { ClassesService } from './classes.service';
import { SeasonsService } from './seasons.service';
import { CoursesService } from './courses.service';
import { ClassesLocationsService } from './classes-locations.service';
import { User } from '../models/user';
import { Course } from '../models/course';
import { StudentsService } from './students.service';
import { Season } from '../models/season';
import { Role } from '../models/role';
import { ClassesLocation } from '../models/classesLocation';
import { RolesService } from './roles.service';
import { Class as ClassModel } from '../models/class';
import { Order, Payment, Product, Student } from '../models';
import { OrdersService } from './orders.service';
import { ProductsService } from './products.service';
import { PaymentsService } from './payments.service';

export interface FilterOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export interface DynamicFilterConfig {
  key: string;
  type: 'select' | 'multiselect' | 'text' | 'date' | 'number';
  label: string;
  placeholder?: string;
  options?: FilterOption[] | (() => Observable<FilterOption[]>);
  multiple?: boolean;
  required?: boolean;
}

export interface RouteFilterConfig {
  defaultFilters: Partial<TableFilterParams>;
  filterType: string;
  dynamicFilters?: DynamicFilterConfig[];
}

@Injectable({
  providedIn: 'root'
})
export class FilterConfigService {

  constructor(
    private usersService: UsersService,
    private coursesService: CoursesService,
    private classesService: ClassesService,
    private seasonsService: SeasonsService,
    private locationsService: ClassesLocationsService, 
    private studentsService: StudentsService,
    private rolesService: RolesService,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private paymentsService: PaymentsService,
  ) {
  }
  
  public routeConfigs: Record<string, RouteFilterConfig> = {
    'students': {
      filterType: 'students',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
        status: 'active'
      },
      dynamicFilters: [
        {
          key: 'instructor_id',
          type: 'select',
          label: 'Instructor',
          placeholder: 'Select instructor',
          options: this.getInstructors.bind(this)
        },
        {
          key: 'course_id',
          type: 'select',
          label: 'Course',
          placeholder: 'Select course',
          options: this.getCourses.bind(this)
        }
      ]
    },
    'courses': {
      filterType: 'courses',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
        status: 'open'
      },
      dynamicFilters: [
        {
          key: 'instructor_id',
          type: 'select',
          label: 'Instructor',
          placeholder: 'Select instructor',
          options: this.getInstructors.bind(this)
        },
        {
          key: 'season_id',
          type: 'select',
          label: 'Season',
          placeholder: 'Select season',
          options: this.getSeasons.bind(this)
        }
      ]
    },
    'classes': {
      filterType: 'classes',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
        status: 'scheduled'
      },
      dynamicFilters: [
        {
          key: 'instructor_id',
          type: 'select',
          label: 'Instructor',
          placeholder: 'Select instructor',
          options: this.getInstructors.bind(this)
        },
        {
          key: 'course_id',
          type: 'select',
          label: 'Course',
          placeholder: 'Select course',
          options: this.getCourses.bind(this)
        },
        {
          key: 'location_id',
          type: 'select',
          label: 'Location',
          placeholder: 'Select location',
          options: this.getLocations.bind(this)
        }
      ]
    },
    'classes-locations': {
      filterType: 'classes-locations',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
        is_active: true
      }
    },
    'users': {
      filterType: 'users',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'first_name',
        sortOrder: 'asc',
        status: 'active'
      },
      dynamicFilters: [
        {
          key: 'role_id',
          type: 'select',
          label: 'Role',
          placeholder: 'Select role',
          options: this.getRoles.bind(this)
        }
      ]
    },
    'products': {
      filterType: 'products',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc'
      }
    },
    'orders': {
      filterType: 'orders',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc',
        status: 'pending'
      },
      dynamicFilters: [
        {
          key: 'student_id',
          type: 'select',
          label: 'Student',
          placeholder: 'Select student',
          options: this.getStudents.bind(this)
        }
      ]
    },
    'payments': {
      filterType: 'payments',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc',
        status: 'pending'
      },
      dynamicFilters: [
        {
          key: 'student_id',
          type: 'select',
          label: 'Student',
          placeholder: 'Select student',
          options: this.getStudents.bind(this)
        },
        {
          key: 'payment_method',
          type: 'select',
          label: 'Payment Method',
          placeholder: 'Select payment method',
          options: () => of([
            { value: 'cash', label: 'Cash' },
            { value: 'credit_card', label: 'Credit Card' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
            { value: 'check', label: 'Check' }
          ])
        }
      ]
    },
    'seasons': {
      filterType: 'seasons',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc'
      }
    },
    'roles': {
      filterType: 'roles',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc'
      }
    },
    'permissions': {
      filterType: 'permissions',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc'
      }
    },
    'course-enrollments': {
      filterType: 'course-enrollments',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
      },
      dynamicFilters: [
        {
          key: 'student_id',
          type: 'select',
          label: 'Student',
          placeholder: 'Select student',
          options: this.getStudents.bind(this)
        },
        {
          key: 'course_id',
          type: 'select',
          label: 'Course',
          placeholder: 'Select course',
          options: this.getCourses.bind(this)
        }
      ]
    },
    'student-classes': {
      filterType: 'student-classes',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
      },
      dynamicFilters: [
        {
          key: 'student_id',
          type: 'select',
          label: 'Student',
          placeholder: 'Select student',
          options: this.getStudents.bind(this)
        },
        {
          key: 'class_id',
          type: 'select',
          label: 'Class',
          placeholder: 'Select class',
          options: this.getClasses.bind(this)
        }
      ]
    },
    'order-items': {
      filterType: 'order-items',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
      },
      dynamicFilters: [
        {
          key: 'order_id',
          type: 'select',
          label: 'Order',
          placeholder: 'Select order',
          options: this.getOrders.bind(this)
        },
        {
          key: 'product_id',
          type: 'select',
          label: 'Product',
          placeholder: 'Select product',
          options: this.getProducts.bind(this)
        }
      ]
    },
    'payment-installments': {
      filterType: 'payment-installments',
      defaultFilters: {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc'
      },
      dynamicFilters: [
        {
          key: 'payment_id',
          type: 'select',
          label: 'Payment',
          placeholder: 'Select payment',
          options: this.getPayments.bind(this)
        }
      ]
    }
  };

  // Static filter configurations for each route type
  private staticFilterConfigs: Record<string, FilterField[]> = {
    courses: [
      { key: 'search', label: 'Search', type: 'text', placeholder: 'Search courses...' },
      { key: 'level', label: 'Level', type: 'select', options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
      ]},
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'draft', label: 'Draft' },
        { value: 'open', label: 'Open' },
        { value: 'full', label: 'Full' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { key: 'day_of_week', label: 'Day', type: 'select', options: [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' }
      ]}
    ],
    students: [
      { key: 'search', label: 'Search', type: 'text', placeholder: 'Search students...' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'graduated', label: 'Graduated' }
      ]},
      { key: 'level', label: 'Level', type: 'select', options: [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
      ]},
      { key: 'age_min', label: 'Min Age', type: 'number', min: 0 },
      { key: 'age_max', label: 'Max Age', type: 'number', min: 0 }
    ],
    classes: [
      { key: 'search', label: 'Search', type: 'text', placeholder: 'Search classes...' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]}
    ],
    users: [
      { key: 'search', label: 'Search', type: 'text', placeholder: 'Search users...' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' }
      ]}
    ],
    orders: [
      { key: 'search', label: 'Search', type: 'text', placeholder: 'Search orders...' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]},
      { key: 'payment_status', label: 'Payment Status', type: 'select', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'partial', label: 'Partial' },
        { value: 'refunded', label: 'Refunded' }
      ]},
      { key: 'total_min', label: 'Min Total', type: 'number', min: 0, step: 0.01 },
      { key: 'total_max', label: 'Max Total', type: 'number', min: 0, step: 0.01 }
    ],
    payments: [
      { key: 'search', label: 'Search', type: 'text', placeholder: 'Search payments...' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' }
      ]},
      { key: 'method', label: 'Method', type: 'select', options: [
        { value: 'cash', label: 'Cash' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'check', label: 'Check' }
      ]},
      { key: 'amount_min', label: 'Min Amount', type: 'number', min: 0, step: 0.01 },
      { key: 'amount_max', label: 'Max Amount', type: 'number', min: 0, step: 0.01 }
    ]
  };

  getRouteConfig(routePath: string): RouteFilterConfig | null {
    return this.routeConfigs[routePath] || null;
  }

  getAllRouteConfigs(): Record<string, RouteFilterConfig> {
    return { ...this.routeConfigs };
  }

  getDefaultFiltersForRoute(routePath: string): Partial<TableFilterParams> | null {
    const config = this.getRouteConfig(routePath);
    return config ? config.defaultFilters : null;
  }

  getDynamicFiltersForRoute(routePath: string): DynamicFilterConfig[] {
    const config = this.getRouteConfig(routePath);
    return config ? config.dynamicFilters || [] : [];
  }

  // Get combined static and dynamic filters for a route
  getCombinedFiltersForRoute(routePath: string): FilterField[] {
    const staticFilters = this.staticFilterConfigs[routePath] || [];
    const dynamicFilters = this.getDynamicFiltersForRoute(routePath);
    
    // Convert dynamic filters to FilterField format
    const convertedDynamicFilters: FilterField[] = dynamicFilters.map(dynamicFilter => ({
      key: dynamicFilter.key,
      label: dynamicFilter.label,
      type: dynamicFilter.type as any,
      placeholder: dynamicFilter.placeholder,
      options: dynamicFilter.options ? 
        (typeof dynamicFilter.options === 'function' ? dynamicFilter.options() : dynamicFilter.options) : 
        undefined
    }));
    
    return [...staticFilters, ...convertedDynamicFilters];
  }

  // Data fetching methods - these would typically call your API services
  private getInstructors(): Observable<FilterOption[]> {
    // This would typically call your instructor service
    // For now, returning mock data
    return this.usersService.getInstructors().pipe(
      map(response => response.data.data.map((instructor: User) => ({ value: instructor.id, label: instructor.first_name + ' ' + instructor.last_name || '' })))
    );
  }

  private getCourses(): Observable<FilterOption[]> {
    // This would typically call your course service
      return this.coursesService.getCourses().pipe(
      map(response => response.data.data.map((course: Course) => ({ value: course.id, label: course.name || '' })))
    );
  }

  private getStudents(): Observable<FilterOption[]> {
    // This would typically call your student service
    return this.studentsService.getStudents().pipe(
      map(response => response.data.data.map((student: Student) => ({ value: student.id, label: student.first_name + ' ' + student.last_name || '' })))
    );
  }

  private getSeasons(): Observable<FilterOption[]> {
    // This would typically call your season service
    return this.seasonsService.getSeasons().pipe(
      map(response => response.data.data.map((season: Season) => ({ value: season.id, label: season.name || '' })))
    );
  }

  private getRoles(): Observable<FilterOption[]> {
    // This would typically call your role service
    return this.rolesService.getRoles().pipe(
      map(response => response.data.data.map((role: Role) => ({ value: role.id, label: role.name || '' })))
    );
  }
  private getLocations(): Observable<FilterOption[]> {
    // This would typically call your location service
    return this.locationsService.getClassesLocations().pipe(
      map(response => response.data.data.map((location: ClassesLocation) => ({ value: location.id, label: location.name || '' })))
    );
  }

  private getClasses(): Observable<FilterOption[]> {
    // This would typically call your class service
    return this.classesService.getClasses().pipe(
      map(response => response.data.data.map((classItem: ClassModel) => ({ value: classItem.id, label: classItem.class_number.toString() || '' })))
    );
  }

  private getOrders(): Observable<FilterOption[]> {
    // This would typically call your order service
    return this.ordersService.getOrders().pipe(
      map(response => response.data.data.map((order: Order) => ({ value: order.id, label: order.order_number || '' })))
    );
  }

  private getProducts(): Observable<FilterOption[]> {
    return this.productsService.getProducts().pipe(
      map(response => response.data.data.map((product: Product) => ({ value: product.id, label: product.name || '' })))
    );
  }

  private getPayments(): Observable<FilterOption[]> {
    // This would typically call your payment service
    return this.paymentsService.getPayments().pipe(
      map(response => response.data.data.map((payment: Payment) => ({ value: payment.id, label: payment.payment_number || '' })))
    );
  }

  // Method to add or update route configuration dynamically
  updateRouteConfig(routePath: string, config: RouteFilterConfig): void {
    this.routeConfigs[routePath] = config;
  }

  // Method to get filter options for a specific dynamic filter
  getFilterOptions(routePath: string, filterKey: string): Observable<FilterOption[]> {
    const dynamicFilters = this.getDynamicFiltersForRoute(routePath);
    const filter = dynamicFilters.find(f => f.key === filterKey);
    
    if (filter && typeof filter.options === 'function') {
      return filter.options();
    }
    
    return of([]);
  }
}
