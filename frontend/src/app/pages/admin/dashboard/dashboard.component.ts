import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from '../user-management/user-management.component';
import { ProductManagementComponent } from '../product-management/product-management.component';
import { CategoryManagementComponent } from '../category-management/category-management.component';
import { OrderManagementComponent } from '../order-management/order-management.component';
import { ReportsComponent } from '../reports/reports.component';
import { ContentManagementComponent } from '../content-management/content-management.component';
import { ReviewManagementComponent } from '../review-management/review-management.component';
import { HomepageSectionsComponent } from '../homepage-sections/homepage-sections.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UserManagementComponent, ProductManagementComponent, CategoryManagementComponent, OrderManagementComponent, ReportsComponent, ContentManagementComponent, ReviewManagementComponent, HomepageSectionsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

}
