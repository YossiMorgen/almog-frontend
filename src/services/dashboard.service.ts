import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudentsService } from './students.service';
import { CoursesService } from './courses.service';
import { ClassesService } from './classes.service';

export interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalClasses: number;
  activeStudents: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private classesService: ClassesService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      students: this.studentsService.getStudents({ limit: 1 }),
      courses: this.coursesService.getCourses({ limit: 1 }),
      classes: this.classesService.getClasses({ limit: 1 }),
      activeStudents: this.studentsService.getStudents({ limit: 1 })
    }).pipe(
      map(response => ({
        totalStudents: response.students.data.pagination.total,
        totalCourses: response.courses.data.pagination.total,
        totalClasses: response.classes.data.pagination.total,
        activeStudents: response.activeStudents.data.pagination.total
      }))
    );
  }

  async getDashboardStatsAsync(): Promise<DashboardStats> {
    try {
      const [studentsRes, coursesRes, classesRes, activeStudentsRes] = await Promise.all([
        this.studentsService.getStudentsAsync({ limit: 1 }),
        this.coursesService.getCoursesAsync({ limit: 1 }),
        this.classesService.getClassesAsync({ limit: 1 }),
        this.studentsService.getStudentsAsync({ limit: 1 })
      ]);

      return {
        totalStudents: studentsRes.data.pagination.total,
        totalCourses: coursesRes.data.pagination.total,
        totalClasses: classesRes.data.pagination.total,
        activeStudents: activeStudentsRes.data.pagination.total
      };
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      throw error;
    }
  }
}


