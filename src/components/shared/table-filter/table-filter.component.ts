import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { FilterField, TableFilterParams } from '../../../models/filter-schemas';
import { RouteFilterService } from '../../../services/route-filter.service';
import { FilterConfigService } from '../../../services/filter-config.service';

@Component({
  selector: 'app-table-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, OnDestroy {
  @Input() filterType: string = '';
  @Input() showAdvanced: boolean = false;
  @Input() autoApply: boolean = true;
  @Output() filterChange = new EventEmitter<Partial<TableFilterParams>>();
  @Output() filterReset = new EventEmitter<void>();

  filterForm: FormGroup;
  filterFields: FilterField[] = [];
  resolvedOptions: { [key: string]: { value: any; label: string }[] } = {};
  isExpanded = false;
  private routeSubscription?: Subscription;
  private formSubscription?: Subscription;
  private urlChangeSubscription?: Subscription;
  private currentBaseUrl = '';
  private isUpdatingFromUrl = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private routeFilterService: RouteFilterService,
    private filterConfigService: FilterConfigService
  ) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeFilterFields();
    this.buildForm();
    this.subscribeToRouteParams();
    this.subscribeToFormChanges();
    this.subscribeToUrlChanges();
    
    // Set filter type from route data if available
    const routeData = this.route.snapshot.data;
    if (routeData['filterType']) {
      this.filterType = routeData['filterType'];
      this.initializeFilterFields();
      this.buildForm();
    }
    
    // Initialize current base URL
    this.currentBaseUrl = this.extractBaseUrl(this.router.url);
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.formSubscription?.unsubscribe();
    this.urlChangeSubscription?.unsubscribe();
  }

  private initializeFilterFields(): void {
    if (this.filterType) {
      this.filterFields = this.filterConfigService.getCombinedFiltersForRoute(this.filterType);
      this.resolveDynamicOptions();
    }
  }

  private resolveDynamicOptions(): void {
    this.filterFields.forEach(field => {
      if (field.type === 'select' && field.options && typeof field.options === 'object' && 'subscribe' in field.options) {
        // This is an Observable
        const observable = field.options as Observable<{ value: any; label: string }[]>;
        observable.subscribe(options => {
          this.resolvedOptions[field.key] = options;
        });
      } else if (field.type === 'select' && field.options && Array.isArray(field.options)) {
        // This is a static array
        this.resolvedOptions[field.key] = field.options as { value: any; label: string }[];
      }
    });
  }

  private buildForm(): void {
    const formControls: { [key: string]: any } = {};
    
    this.filterFields.forEach(field => {
      formControls[field.key] = [null];
    });

    this.filterForm = this.fb.group(formControls);
  }

  private subscribeToRouteParams(): void {
    this.routeSubscription = this.route.queryParams.subscribe(params => {
      this.updateFormFromParams(params);
    });
  }

  private subscribeToFormChanges(): void {
    if (this.autoApply) {
      this.formSubscription = this.filterForm.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(() => {
          if (!this.isUpdatingFromUrl) {
            this.applyFilters();
          }
        });
    }
  }

  private subscribeToUrlChanges(): void {
    this.urlChangeSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        const newBaseUrl = this.extractBaseUrl(event.url);
        
        // Check if base URL changed (ignoring query parameters)
        if (newBaseUrl !== this.currentBaseUrl) {
          this.currentBaseUrl = newBaseUrl;
          this.updateFilterConfigurationForNewRoute();
        }
      });
  }

  private extractBaseUrl(url: string): string {
    // Extract base URL without query parameters
    return url.split('?')[0];
  }

  private updateFilterConfigurationForNewRoute(): void {
    // Get the route configuration for the new route
    const routeConfig = this.routeFilterService.getCurrentRouteConfig();
    
    if (routeConfig && routeConfig.filterType !== this.filterType) {
      // Update filter type and reinitialize
      this.filterType = routeConfig.filterType;
      this.initializeFilterFields();
      this.buildForm();
      
      // Update form with current route filters
      const currentFilters = this.routeFilterService.getCurrentRouteFilters();
      this.updateFormFromFilters(currentFilters);
    }
  }

  private updateFormFromFilters(filters: Partial<TableFilterParams>): void {
    this.isUpdatingFromUrl = true;
    const formValue: { [key: string]: any } = {};
    
    this.filterFields.forEach(field => {
      const filterValue = filters[field.key as keyof TableFilterParams];
      if (filterValue !== undefined) {
        formValue[field.key] = filterValue;
      } else {
        formValue[field.key] = null;
      }
    });

    this.filterForm.patchValue(formValue, { emitEvent: false });
    this.isUpdatingFromUrl = false;
  }

  private updateFormFromParams(params: Params): void {
    this.isUpdatingFromUrl = true;
    const formValue: { [key: string]: any } = {};
    
    this.filterFields.forEach(field => {
      const paramValue = params[field.key];
      if (paramValue !== undefined) {
        switch (field.type) {
          case 'number':
            formValue[field.key] = paramValue ? Number(paramValue) : null;
            break;
          case 'boolean':
            formValue[field.key] = paramValue === 'true';
            break;
          case 'date':
          case 'dateRange':
            formValue[field.key] = paramValue ? new Date(paramValue) : null;
            break;
          default:
            formValue[field.key] = paramValue || null;
        }
      } else {
        formValue[field.key] = null;
      }
    });

    this.filterForm.patchValue(formValue, { emitEvent: false });
    this.isUpdatingFromUrl = false;
  }

  private applyFilters(): void {
    const formValue = this.filterForm.value;
    const cleanParams: Partial<TableFilterParams> = {};

    Object.keys(formValue).forEach(key => {
      const value = formValue[key];
      if (value !== null && value !== undefined && value !== '') {
        cleanParams[key as keyof TableFilterParams] = value;
      }
    });

    this.routeFilterService.updateFilters(cleanParams);
    this.filterChange.emit(cleanParams);
  }

  private updateUrlParams(params: Partial<TableFilterParams>): void {
    const queryParams: Params = {};
    
    Object.keys(params).forEach(key => {
      const value = params[key as keyof TableFilterParams];
      if (value !== null && value !== undefined && value !== '') {
        queryParams[key] = value;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  onApplyFilters(): void {
    this.applyFilters();
  }

  onResetFilters(): void {
    this.filterForm.reset();
    this.routeFilterService.resetToDefaults();
    this.filterReset.emit();
  }

  onClearField(fieldKey: string): void {
    this.filterForm.get(fieldKey)?.setValue(null);
  }

  toggleExpansion(): void {
    this.isExpanded = !this.isExpanded;
  }

  getFieldValue(fieldKey: string): any {
    return this.filterForm.get(fieldKey)?.value;
  }

  hasActiveFilters(): boolean {
    return this.filterFields.some(field => {
      const value = this.getFieldValue(field.key);
      return value !== null && value !== undefined && value !== '';
    });
  }

  getActiveFilterCount(): number {
    return this.filterFields.filter(field => {
      const value = this.getFieldValue(field.key);
      return value !== null && value !== undefined && value !== '';
    }).length;
  }

  getFieldDisplayValue(fieldKey: string): string {
    const field = this.filterFields.find(f => f.key === fieldKey);
    const value = this.getFieldValue(fieldKey);
    
    if (!field || value === null || value === undefined || value === '') {
      return '';
    }

    if (field.type === 'select' && this.resolvedOptions[fieldKey]) {
      const option = this.resolvedOptions[fieldKey].find(opt => opt.value === value);
      return option ? option.label : String(value);
    }

    if (field.type === 'date') {
      return new Date(value).toLocaleDateString();
    }

    return String(value);
  }
}
