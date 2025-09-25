import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, CreateStudent, UpdateStudent } from '../models/student';
import { Course, CreateCourse, UpdateCourse } from '../models/course';
import { Class, CreateClass, UpdateClass } from '../models/class';
import { Season, CreateSeason, UpdateSeason } from '../models/season';
import { User, CreateUser, UpdateUser } from '../models/user';
import { Product, CreateProduct, UpdateProduct } from '../models/product';
import { Order, CreateOrder, UpdateOrder } from '../models/order';
import { Payment, CreatePayment, UpdatePayment } from '../models/payment';
import { Role, CreateRole, UpdateRole } from '../models/role';
import { Permission, CreatePermission, UpdatePermission } from '../models/permission';
import { CourseEnrollment, CreateCourseEnrollment, UpdateCourseEnrollment } from '../models/courseEnrollment';
import { StudentClass, CreateStudentClass, UpdateStudentClass } from '../models/studentClass';
import { OrderItem, CreateOrderItem, UpdateOrderItem } from '../models/orderItem';
import { PaymentInstallment, CreatePaymentInstallment, UpdatePaymentInstallment } from '../models/paymentInstallment';

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  season_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3040/api';

  constructor(private http: HttpClient) {}

  private buildParams(query: PaginationQuery): HttpParams {
    let params = new HttpParams();
    
    if (query.page) params = params.set('page', query.page.toString());
    if (query.limit) params = params.set('limit', query.limit.toString());
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortOrder) params = params.set('sortOrder', query.sortOrder);
    if (query.search) params = params.set('search', query.search);
    if (query.season_id) params = params.set('season_id', query.season_id.toString());
    
    return params;
  }

  getStudents(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Student>>> {
    return this.http.get<ApiResponse<PaginationResult<Student>>>(`${this.baseUrl}/students`, {
      params: this.buildParams(query)
    });
  }

  getStudent(id: number): Observable<ApiResponse<Student>> {
    return this.http.get<ApiResponse<Student>>(`${this.baseUrl}/students/${id}`);
  }

  createStudent(student: CreateStudent): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(`${this.baseUrl}/students`, student);
  }

  updateStudent(id: number, student: UpdateStudent): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.baseUrl}/students/${id}`, student);
  }

  getCourses(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Course>>> {
    return this.http.get<ApiResponse<PaginationResult<Course>>>(`${this.baseUrl}/courses`, {
      params: this.buildParams(query)
    });
  }

  getCourse(id: number): Observable<ApiResponse<Course>> {
    return this.http.get<ApiResponse<Course>>(`${this.baseUrl}/courses/${id}`);
  }

  createCourse(course: CreateCourse): Observable<ApiResponse<Course>> {
    return this.http.post<ApiResponse<Course>>(`${this.baseUrl}/courses`, course);
  }

  updateCourse(id: number, course: UpdateCourse): Observable<ApiResponse<Course>> {
    return this.http.put<ApiResponse<Course>>(`${this.baseUrl}/courses/${id}`, course);
  }

  getClasses(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Class>>> {
    return this.http.get<ApiResponse<PaginationResult<Class>>>(`${this.baseUrl}/classes`, {
      params: this.buildParams(query)
    });
  }

  getClass(id: number): Observable<ApiResponse<Class>> {
    return this.http.get<ApiResponse<Class>>(`${this.baseUrl}/classes/${id}`);
  }

  createClass(classData: CreateClass): Observable<ApiResponse<Class>> {
    return this.http.post<ApiResponse<Class>>(`${this.baseUrl}/classes`, classData);
  }

  updateClass(id: number, classData: UpdateClass): Observable<ApiResponse<Class>> {
    return this.http.put<ApiResponse<Class>>(`${this.baseUrl}/classes/${id}`, classData);
  }

  // Seasons
  getSeasons(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Season>>> {
    return this.http.get<ApiResponse<PaginationResult<Season>>>(`${this.baseUrl}/seasons`, {
      params: this.buildParams(query)
    });
  }

  getSeason(id: number): Observable<ApiResponse<Season>> {
    return this.http.get<ApiResponse<Season>>(`${this.baseUrl}/seasons/${id}`);
  }

  createSeason(season: CreateSeason): Observable<ApiResponse<Season>> {
    return this.http.post<ApiResponse<Season>>(`${this.baseUrl}/seasons`, season);
  }

  updateSeason(id: number, season: UpdateSeason): Observable<ApiResponse<Season>> {
    return this.http.put<ApiResponse<Season>>(`${this.baseUrl}/seasons/${id}`, season);
  }

  // Users
  getUsers(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<User>>> {
    return this.http.get<ApiResponse<PaginationResult<User>>>(`${this.baseUrl}/users`, {
      params: this.buildParams(query)
    });
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: CreateUser): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: number, user: UpdateUser): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/users/${id}`, user);
  }

  // Products
  getProducts(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Product>>> {
    return this.http.get<ApiResponse<PaginationResult<Product>>>(`${this.baseUrl}/products`, {
      params: this.buildParams(query)
    });
  }

  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(product: CreateProduct): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/products`, product);
  }

  updateProduct(id: number, product: UpdateProduct): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/products/${id}`, product);
  }

  // Orders
  getOrders(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Order>>> {
    return this.http.get<ApiResponse<PaginationResult<Order>>>(`${this.baseUrl}/orders`, {
      params: this.buildParams(query)
    });
  }

  getOrder(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(`${this.baseUrl}/orders/${id}`);
  }

  createOrder(order: CreateOrder): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(`${this.baseUrl}/orders`, order);
  }

  updateOrder(id: number, order: UpdateOrder): Observable<ApiResponse<Order>> {
    return this.http.put<ApiResponse<Order>>(`${this.baseUrl}/orders/${id}`, order);
  }

  // Payments
  getPayments(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Payment>>> {
    return this.http.get<ApiResponse<PaginationResult<Payment>>>(`${this.baseUrl}/payments`, {
      params: this.buildParams(query)
    });
  }

  getPayment(id: number): Observable<ApiResponse<Payment>> {
    return this.http.get<ApiResponse<Payment>>(`${this.baseUrl}/payments/${id}`);
  }

  createPayment(payment: CreatePayment): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(`${this.baseUrl}/payments`, payment);
  }

  updatePayment(id: number, payment: UpdatePayment): Observable<ApiResponse<Payment>> {
    return this.http.put<ApiResponse<Payment>>(`${this.baseUrl}/payments/${id}`, payment);
  }

  // Roles
  getRoles(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Role>>> {
    return this.http.get<ApiResponse<PaginationResult<Role>>>(`${this.baseUrl}/roles`, {
      params: this.buildParams(query)
    });
  }

  getRole(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.baseUrl}/roles/${id}`);
  }

  createRole(role: CreateRole): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(`${this.baseUrl}/roles`, role);
  }

  updateRole(id: number, role: UpdateRole): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.baseUrl}/roles/${id}`, role);
  }

  // Permissions
  getPermissions(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<Permission>>> {
    return this.http.get<ApiResponse<PaginationResult<Permission>>>(`${this.baseUrl}/permissions`, {
      params: this.buildParams(query)
    });
  }

  getPermission(id: number): Observable<ApiResponse<Permission>> {
    return this.http.get<ApiResponse<Permission>>(`${this.baseUrl}/permissions/${id}`);
  }

  createPermission(permission: CreatePermission): Observable<ApiResponse<Permission>> {
    return this.http.post<ApiResponse<Permission>>(`${this.baseUrl}/permissions`, permission);
  }

  updatePermission(id: number, permission: UpdatePermission): Observable<ApiResponse<Permission>> {
    return this.http.put<ApiResponse<Permission>>(`${this.baseUrl}/permissions/${id}`, permission);
  }

  // Course Enrollments
  getCourseEnrollments(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<CourseEnrollment>>> {
    return this.http.get<ApiResponse<PaginationResult<CourseEnrollment>>>(`${this.baseUrl}/course-enrollments`, {
      params: this.buildParams(query)
    });
  }

  getCourseEnrollment(id: number): Observable<ApiResponse<CourseEnrollment>> {
    return this.http.get<ApiResponse<CourseEnrollment>>(`${this.baseUrl}/course-enrollments/${id}`);
  }

  createCourseEnrollment(enrollment: CreateCourseEnrollment): Observable<ApiResponse<CourseEnrollment>> {
    return this.http.post<ApiResponse<CourseEnrollment>>(`${this.baseUrl}/course-enrollments`, enrollment);
  }

  updateCourseEnrollment(id: number, enrollment: UpdateCourseEnrollment): Observable<ApiResponse<CourseEnrollment>> {
    return this.http.put<ApiResponse<CourseEnrollment>>(`${this.baseUrl}/course-enrollments/${id}`, enrollment);
  }

  // Student Classes
  getStudentClasses(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<StudentClass>>> {
    return this.http.get<ApiResponse<PaginationResult<StudentClass>>>(`${this.baseUrl}/student-classes`, {
      params: this.buildParams(query)
    });
  }

  getStudentClass(id: number): Observable<ApiResponse<StudentClass>> {
    return this.http.get<ApiResponse<StudentClass>>(`${this.baseUrl}/student-classes/${id}`);
  }

  createStudentClass(studentClass: CreateStudentClass): Observable<ApiResponse<StudentClass>> {
    return this.http.post<ApiResponse<StudentClass>>(`${this.baseUrl}/student-classes`, studentClass);
  }

  updateStudentClass(id: number, studentClass: UpdateStudentClass): Observable<ApiResponse<StudentClass>> {
    return this.http.put<ApiResponse<StudentClass>>(`${this.baseUrl}/student-classes/${id}`, studentClass);
  }

  // Order Items
  getOrderItems(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<OrderItem>>> {
    return this.http.get<ApiResponse<PaginationResult<OrderItem>>>(`${this.baseUrl}/order-items`, {
      params: this.buildParams(query)
    });
  }

  getOrderItem(id: number): Observable<ApiResponse<OrderItem>> {
    return this.http.get<ApiResponse<OrderItem>>(`${this.baseUrl}/order-items/${id}`);
  }

  createOrderItem(orderItem: CreateOrderItem): Observable<ApiResponse<OrderItem>> {
    return this.http.post<ApiResponse<OrderItem>>(`${this.baseUrl}/order-items`, orderItem);
  }

  updateOrderItem(id: number, orderItem: UpdateOrderItem): Observable<ApiResponse<OrderItem>> {
    return this.http.put<ApiResponse<OrderItem>>(`${this.baseUrl}/order-items/${id}`, orderItem);
  }

  // Payment Installments
  getPaymentInstallments(query: PaginationQuery = {}): Observable<ApiResponse<PaginationResult<PaymentInstallment>>> {
    return this.http.get<ApiResponse<PaginationResult<PaymentInstallment>>>(`${this.baseUrl}/payment-installments`, {
      params: this.buildParams(query)
    });
  }

  getPaymentInstallment(id: number): Observable<ApiResponse<PaymentInstallment>> {
    return this.http.get<ApiResponse<PaymentInstallment>>(`${this.baseUrl}/payment-installments/${id}`);
  }

  createPaymentInstallment(installment: CreatePaymentInstallment): Observable<ApiResponse<PaymentInstallment>> {
    return this.http.post<ApiResponse<PaymentInstallment>>(`${this.baseUrl}/payment-installments`, installment);
  }

  updatePaymentInstallment(id: number, installment: UpdatePaymentInstallment): Observable<ApiResponse<PaymentInstallment>> {
    return this.http.put<ApiResponse<PaymentInstallment>>(`${this.baseUrl}/payment-installments/${id}`, installment);
  }
}
