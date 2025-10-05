import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { TableFilterComponent } from '../../shared/table-filter/table-filter.component';
import { FilterService } from '../../../services/filter.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SideNavComponent, TableFilterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  @Input() title?: string;
  @Input() currentUser: any = null;
  @Input() showNavigation: boolean = true;
  
  public isSideNavCollapsed: boolean = false;
  public showFilters$: Observable<boolean>;
  public currentFilterType$: Observable<string>;

  constructor(private filterService: FilterService) {
    this.showFilters$ = this.filterService.showFilters$;
    this.currentFilterType$ = this.filterService.currentFilterType$;
  }

  toggleSideNav(): void {
    this.isSideNavCollapsed = !this.isSideNavCollapsed;
  }
}
