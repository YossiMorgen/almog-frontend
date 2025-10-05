import { z } from 'zod';

export const TableFilterSchema = z.object({
  search: z.string().optional().nullable(),
  page: z.number().min(1).optional().nullable(),
  limit: z.number().min(1).max(100).optional().nullable(),
  sortBy: z.string().optional().nullable(),
  sortOrder: z.enum(['asc', 'desc']).optional().nullable(),
  status: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  season_id: z.number().optional().nullable(),
  day_of_week: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  created_from: z.string().optional().nullable(),
  created_to: z.string().optional().nullable(),
  updated_from: z.string().optional().nullable(),
  updated_to: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
});

export type TableFilterParams = z.infer<typeof TableFilterSchema>;

export const CourseFilterSchema = TableFilterSchema.extend({
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional().nullable(),
  status: z.enum(['draft', 'open', 'full', 'in_progress', 'completed', 'cancelled']).optional().nullable(),
  day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional().nullable(),
});

export type CourseFilterParams = z.infer<typeof CourseFilterSchema>;

export const StudentFilterSchema = TableFilterSchema.extend({
  status: z.enum(['active', 'inactive', 'suspended', 'graduated']).optional().nullable(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional().nullable(),
  age_min: z.number().min(0).optional().nullable(),
  age_max: z.number().min(0).optional().nullable(),
});

export type StudentFilterParams = z.infer<typeof StudentFilterSchema>;

export const ClassFilterSchema = TableFilterSchema.extend({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional().nullable(),
  instructor_id: z.number().optional().nullable(),
  location_id: z.number().optional().nullable(),
});

export type ClassFilterParams = z.infer<typeof ClassFilterSchema>;

export const UserFilterSchema = TableFilterSchema.extend({
  role: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'suspended']).optional().nullable(),
});

export type UserFilterParams = z.infer<typeof UserFilterSchema>;

export const OrderFilterSchema = TableFilterSchema.extend({
  status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']).optional().nullable(),
  payment_status: z.enum(['pending', 'paid', 'partial', 'refunded']).optional().nullable(),
  total_min: z.number().min(0).optional().nullable(),
  total_max: z.number().min(0).optional().nullable(),
});

export type OrderFilterParams = z.infer<typeof OrderFilterSchema>;

export const PaymentFilterSchema = TableFilterSchema.extend({
  status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional().nullable(),
  method: z.enum(['cash', 'credit_card', 'bank_transfer', 'check']).optional().nullable(),
  amount_min: z.number().min(0).optional().nullable(),
  amount_max: z.number().min(0).optional().nullable(),
});

export type PaymentFilterParams = z.infer<typeof PaymentFilterSchema>;

export const FilterFieldType = z.enum([
  'text',
  'number',
  'select',
  'date',
  'dateRange',
  'multiselect',
  'boolean'
]);

export type FilterFieldTypeType = z.infer<typeof FilterFieldType>;

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldTypeType;
  options?: { value: any; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const FILTER_CONFIGS: Record<string, FilterField[]> = {
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
    ]},
    { key: 'season_id', label: 'Season', type: 'number', min: 1 },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'open', label: 'Open' },
      { value: 'full', label: 'Full' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ]},
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
    { key: 'age_max', label: 'Max Age', type: 'number', min: 0 },
  ],
  classes: [
    { key: 'search', label: 'Search', type: 'text', placeholder: 'Search classes...' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ]},
    { key: 'instructor_id', label: 'Instructor', type: 'number', min: 1 },
    { key: 'location_id', label: 'Location', type: 'number', min: 1 },
  ],
  users: [
    { key: 'search', label: 'Search', type: 'text', placeholder: 'Search users...' },
    { key: 'role', label: 'Role', type: 'text', placeholder: 'Role name...' },
    { key: 'status', label: 'Status', type: 'select', options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'suspended', label: 'Suspended' }
    ]},
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
    { key: 'total_max', label: 'Max Total', type: 'number', min: 0, step: 0.01 },
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
    { key: 'amount_max', label: 'Max Amount', type: 'number', min: 0, step: 0.01 },
  ],
};
