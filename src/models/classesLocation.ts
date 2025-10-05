export interface ClassesLocation {
  id?: number;
  tenant_id?: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  capacity: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
}

export interface CreateClassesLocation {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  capacity: number;
  is_active: boolean;
  created_by?: number;
}

export interface UpdateClassesLocation {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  is_active?: boolean;
  created_by?: number;
}
