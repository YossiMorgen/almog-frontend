import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RouteFilterService } from '../../../services/route-filter.service';
import { FilterService } from '../../../services/filter.service';
import { TableFilterParams } from '../../../models/filter-schemas';

@Component({
  selector: 'app-table-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss']
})
export class TableWrapperComponent implements OnInit, OnDestroy {
  @Input() filterType: string = '';
  @Input() autoLoad: boolean = true;
  @Output() filterChange = new EventEmitter<Partial<TableFilterParams>>();
  @Output() dataLoad = new EventEmitter<Partial<TableFilterParams>>();

  @ContentChild('tableContent') tableContent!: TemplateRef<any>;

  currentFilters: Partial<TableFilterParams> = {};
  private filterSubscription?: Subscription;

  constructor(
    private routeFilterService: RouteFilterService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    if (this.filterType) {
      this.filterService.setFilterType(this.filterType);
    }

    // Subscribe to route filter changes
    this.filterSubscription = this.routeFilterService.currentRouteFilters$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        this.currentFilters = filters;
        this.filterChange.emit(filters);
        
        if (this.autoLoad) {
          this.dataLoad.emit(filters);
        }
      });

    // Initial load with current filters
    const initialFilters = this.routeFilterService.getCurrentRouteFilters();
    this.currentFilters = initialFilters;
    this.filterChange.emit(initialFilters);
    
    if (this.autoLoad) {
      this.dataLoad.emit(initialFilters);
    }
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  updateFilters(filters: Partial<TableFilterParams>): void {
    this.routeFilterService.updateFilters(filters);
  }

  resetFilters(): void {
    this.routeFilterService.resetToDefaults();
  }

  clearFilters(): void {
    this.routeFilterService.clearFilters();
  }

  getCurrentFilters(): Partial<TableFilterParams> {
    return this.routeFilterService.getCurrentRouteFilters();
  }
}
