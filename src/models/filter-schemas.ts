import { z } from 'zod';
import { Observable } from 'rxjs';

export const TableFilterSchema = z.object({
  search: z.string().optional().nullable(),
  page: z.number().min(1).optional().nullable(),
  limit: z.number().min(1).max(100).optional().nullable(),
  sortBy: z.string().optional().nullable(),
  sortOrder: z.enum(['asc', 'desc']).optional().nullable(),
  status: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  season_id: z.number().optional().nullable(),
  instructor_id: z.number().optional().nullable(),
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


export const ClassFilterSchema = TableFilterSchema.extend({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional().nullable(),
  instructor_id: z.number().optional().nullable(),
  location_id: z.number().optional().nullable(),
  course_id: z.number().optional().nullable(),
  class_date_from: z.string().optional().nullable(),
  class_date_to: z.string().optional().nullable(),
});

export type ClassFilterParams = z.infer<typeof ClassFilterSchema>;

export const ClassesLocationFilterSchema = TableFilterSchema.extend({
  city: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  capacity_min: z.number().min(0).optional().nullable(),
  capacity_max: z.number().min(0).optional().nullable(),
});

export type ClassesLocationFilterParams = z.infer<typeof ClassesLocationFilterSchema>;

export const CourseEnrollmentFilterSchema = TableFilterSchema.extend({
  status: z.enum(['enrolled', 'waitlisted', 'dropped', 'completed']).optional().nullable(),
  student_id: z.number().optional().nullable(),
  course_id: z.number().optional().nullable(),
  enrollment_date_from: z.string().optional().nullable(),
  enrollment_date_to: z.string().optional().nullable(),
});

export type CourseEnrollmentFilterParams = z.infer<typeof CourseEnrollmentFilterSchema>;

export const OrderItemFilterSchema = TableFilterSchema.extend({
  order_id: z.number().optional().nullable(),
  item_type: z.enum(['course', 'product']).optional().nullable(),
  item_id: z.number().optional().nullable(),
  quantity_min: z.number().min(0).optional().nullable(),
  quantity_max: z.number().min(0).optional().nullable(),
  unit_price_min: z.number().min(0).optional().nullable(),
  unit_price_max: z.number().min(0).optional().nullable(),
});

export type OrderItemFilterParams = z.infer<typeof OrderItemFilterSchema>;

export const OrderFilterSchema = TableFilterSchema.extend({
  student_id: z.number().optional().nullable(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'refunded']).optional().nullable(),
  order_date_from: z.string().optional().nullable(),
  order_date_to: z.string().optional().nullable(),
  total_amount_min: z.number().min(0).optional().nullable(),
  total_amount_max: z.number().min(0).optional().nullable(),
});

export type OrderFilterParams = z.infer<typeof OrderFilterSchema>;

export const PaymentInstallmentFilterSchema = TableFilterSchema.extend({
  payment_id: z.number().optional().nullable(),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled', 'refunded']).optional().nullable(),
  payment_method: z.enum(['cash', 'check', 'credit_card', 'debit_card', 'bank_transfer', 'other']).optional().nullable(),
  payment_date_from: z.string().optional().nullable(),
  payment_date_to: z.string().optional().nullable(),
  amount_min: z.number().min(0).optional().nullable(),
  amount_max: z.number().min(0).optional().nullable(),
});

export type PaymentInstallmentFilterParams = z.infer<typeof PaymentInstallmentFilterSchema>;

export const PaymentFilterSchema = TableFilterSchema.extend({
  order_id: z.number().optional().nullable(),
  payment_status: z.enum(['pending', 'partial', 'completed', 'overdue', 'cancelled', 'refunded']).optional().nullable(),
  due_date_from: z.string().optional().nullable(),
  due_date_to: z.string().optional().nullable(),
  total_amount_min: z.number().min(0).optional().nullable(),
  total_amount_max: z.number().min(0).optional().nullable(),
  paid_amount_min: z.number().min(0).optional().nullable(),
  paid_amount_max: z.number().min(0).optional().nullable(),
});

export type PaymentFilterParams = z.infer<typeof PaymentFilterSchema>;

export const UserFilterSchema = TableFilterSchema.extend({
  role: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'suspended']).optional().nullable(),
});

export type UserFilterParams = z.infer<typeof UserFilterSchema>;

export const PermissionFilterSchema = TableFilterSchema.extend({
  module: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
});

export type PermissionFilterParams = z.infer<typeof PermissionFilterSchema>;

export const ProductFilterSchema = TableFilterSchema.extend({
  category: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  price_min: z.number().min(0).optional().nullable(),
  price_max: z.number().min(0).optional().nullable(),
  stock_quantity_min: z.number().min(0).optional().nullable(),
  stock_quantity_max: z.number().min(0).optional().nullable(),
});

export type ProductFilterParams = z.infer<typeof ProductFilterSchema>;

export const RoleFilterSchema = TableFilterSchema.extend({
  is_system: z.boolean().optional().nullable(),
});

export type RoleFilterParams = z.infer<typeof RoleFilterSchema>;

export const SeasonFilterSchema = TableFilterSchema.extend({
  year: z.number().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  start_date_from: z.string().optional().nullable(),
  start_date_to: z.string().optional().nullable(),
  end_date_from: z.string().optional().nullable(),
  end_date_to: z.string().optional().nullable(),
});

export type SeasonFilterParams = z.infer<typeof SeasonFilterSchema>;

export const StudentClassFilterSchema = TableFilterSchema.extend({
  class_id: z.number().optional().nullable(),
  student_id: z.number().optional().nullable(),
  attendance_status: z.enum(['present', 'absent', 'late', 'excused']).optional().nullable(),
  marked_at_from: z.string().optional().nullable(),
  marked_at_to: z.string().optional().nullable(),
});

export type StudentClassFilterParams = z.infer<typeof StudentClassFilterSchema>;

export const StudentFilterSchema = TableFilterSchema.extend({
  gender: z.enum(['male', 'female', 'other']).optional().nullable(),
  is_active: z.boolean().optional().nullable(),
  parent_name: z.string().optional().nullable(),
  student_code: z.string().optional().nullable(),
  date_of_birth_from: z.string().optional().nullable(),
  date_of_birth_to: z.string().optional().nullable(),
});

export type StudentFilterParams = z.infer<typeof StudentFilterSchema>;

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
  options?: { value: any; label: string }[] | Observable<{ value: any; label: string }[]>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}


