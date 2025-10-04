import { PERMISSIONS, Permission } from "./permissions.config";

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  permissions?: Permission[];
  children?: NavigationItem[];
  expanded?: boolean;
  order?: number;
}

export interface NavigationSection {
  id: string;
  label: string;
  icon: string;
  permissions?: Permission[];
  items: NavigationItem[];
  expanded?: boolean;
  order?: number;
}

export const NAVIGATION_CONFIG: NavigationSection[] = [
  {
    id: 'main',
    label: 'Main',
    icon: 'home',
    items: [
      {
        id: 'home',
        label: 'Home',
        icon: 'home',
        route: '/home',
        order: 1
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/crm',
        order: 2
      }
    ],
    expanded: false,
    order: 1
  },
  {
    id: 'academic',
    label: 'Academic',
    icon: 'school',
    permissions: [PERMISSIONS.CLASSES.READ, PERMISSIONS.SEASONS.READ, PERMISSIONS.STUDENTS.READ, PERMISSIONS.COURSES.READ],
    items: [
      {
        id: 'seasons',
        label: 'Seasons',
        icon: 'calendar_today',
        route: '/crm/seasons',
        permissions: [PERMISSIONS.SEASONS.READ],
        order: 1
      },
      {
        id: 'students',
        label: 'Students',
        icon: 'person',
        route: '/crm/students',
        permissions: [PERMISSIONS.STUDENTS.READ],
        order: 2
      },
      {
        id: 'courses',
        label: 'Courses',
        icon: 'book',
        route: '/crm/courses',
        permissions: [PERMISSIONS.COURSES.READ],
        order: 3
      },
      {
        id: 'classes',
        label: 'Classes',
        icon: 'class',
        route: '/crm/classes',
        permissions: [PERMISSIONS.CLASSES.READ],
        order: 4
      },
      {
        id: 'course-enrollments',
        label: 'Enrollments',
        icon: 'assignment',
        route: '/crm/course-enrollments',
        permissions: [PERMISSIONS.STUDENTS.READ, PERMISSIONS.COURSES.READ],
        order: 5
      },
      {
        id: 'student-classes',
        label: 'Student Classes',
        icon: 'group',
        route: '/crm/student-classes',
        permissions: [PERMISSIONS.STUDENTS.READ],
        order: 6
      }
    ],
    expanded: false,
    order: 2
  },
  {
    id: 'business',
    label: 'Business',
    icon: 'business',
    permissions: [PERMISSIONS.PRODUCTS.READ, PERMISSIONS.ORDERS.READ, PERMISSIONS.PAYMENTS.READ],
    items: [
      {
        id: 'products',
        label: 'Products',
        icon: 'inventory_2',
        route: '/crm/products',
        permissions: [PERMISSIONS.PRODUCTS.READ],
        order: 1
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: 'shopping_cart',
        route: '/crm/orders',
        permissions: [PERMISSIONS.ORDERS.READ],
        order: 2
      },
      {
        id: 'order-items',
        label: 'Order Items',
        icon: 'list',
        route: '/crm/order-items',
        permissions: [PERMISSIONS.ORDERS.READ],
        order: 3
      },
      {
        id: 'payments',
        label: 'Payments',
        icon: 'payment',
        route: '/crm/payments',
        permissions: [PERMISSIONS.PAYMENTS.READ],
        order: 4
      },
      {
        id: 'payment-installments',
        label: 'Payment Installments',
        icon: 'schedule',
        route: '/crm/payment-installments',
        permissions: [PERMISSIONS.PAYMENTS.READ],
        order: 5
      }
    ],
    expanded: false,
    order: 3
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: 'admin_panel_settings',
    permissions: [PERMISSIONS.USERS.READ],
    items: [
      {
        id: 'users',
        label: 'Users',
        icon: 'people',
        route: '/crm/users',
        permissions: [PERMISSIONS.USERS.READ],
        order: 1
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: 'security',
        route: '/crm/roles',
        permissions: [PERMISSIONS.USERS.UPDATE],
        order: 2
      },
      {
        id: 'permissions',
        label: 'Permissions',
        icon: 'lock',
        route: '/crm/permissions',
        permissions: [PERMISSIONS.USERS.UPDATE],
        order: 3
      }
    ],
    expanded: false,
    order: 4
  }
];

export const getNavigationConfig = (): NavigationSection[] => {
  return NAVIGATION_CONFIG.sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getNavigationItemByRoute = (route: string): NavigationItem | null => {
  for (const section of NAVIGATION_CONFIG) {
    for (const item of section.items) {
      if (item.route === route) {
        return item;
      }
    }
  }
  return null;
};

export const getNavigationSectionById = (id: string): NavigationSection | null => {
  return NAVIGATION_CONFIG.find(section => section.id === id) || null;
};
