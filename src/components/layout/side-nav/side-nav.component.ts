import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PermissionService } from '../../../services/permission.service';
import { NAVIGATION_CONFIG, NavigationSection, NavigationItem } from '../../../config/navigation.config';
import { Permission } from '../../../config/permissions.config';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
  @Input() isCollapsed: boolean = false;
  
  public navigationConfig: NavigationSection[] = [];
  public expandedSections: { [key: string]: boolean } = {};

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadNavigationConfig();
  }

  private loadNavigationConfig(): void {
    this.navigationConfig = NAVIGATION_CONFIG.filter(section => 
      section.permissions?.every(permission => this.hasPermission(permission).pipe(map(result => result))) || true
    ).map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.permissions?.every(permission => this.hasPermission(permission).pipe(map(result => result))) || true
      )
    }));
    
    // Initialize expanded state for each section
    this.navigationConfig.forEach(section => {
      this.expandedSections[section.id] = section.expanded || false;
    });
  }

  private hasPermission(permission?: Permission): Observable<boolean> {
    if (!permission) return of(true);
    return this.permissionService.hasPermission(permission);
  }

  toggleSection(sectionId: string): void {
    this.expandedSections[sectionId] = !this.expandedSections[sectionId];
  }

  isSectionExpanded(sectionId: string): boolean {
    return this.expandedSections[sectionId];
  }

  onNavigationClick(event: Event): void {
    event.stopPropagation();
  }
}
