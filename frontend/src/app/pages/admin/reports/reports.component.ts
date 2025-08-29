import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AdminService, SalesSummary, PopularProduct } from '../../../services/admin.service';
import { ToastService } from '../../../services/toast.service';
import { forkJoin } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartOptions, ChartType, ChartData, registerables } from 'chart.js';
import { ProductReviewAdmin } from '../../../services/admin.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, BaseChartDirective],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    isLoading = true;
    summary: SalesSummary | null = null;
    popularProducts: PopularProduct[] = [];
    recentReviews: ProductReviewAdmin[] = [];

    public barChartOptions: ChartOptions = {
        responsive: true,
    };
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartData: ChartData<'bar'> = {
        labels: [],
        datasets: [
            { data: [], label: 'Quantity Sold', backgroundColor: '#3498db', hoverBackgroundColor: '#2980b9' }
        ]
    };

    constructor(
        private adminService: AdminService,
        private toastService: ToastService
    ) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.loadReports();
    }

    loadReports(): void {
        this.isLoading = true;
        forkJoin({
            summary: this.adminService.getSalesSummary(),
            popularProducts: this.adminService.getPopularProducts(),
            recentReviews: this.adminService.getRecentReviews()
        }).subscribe({
            next: ({ summary, popularProducts, recentReviews }) => {
                this.summary = summary;
                this.popularProducts = popularProducts;
                this.recentReviews = recentReviews;
                this.isLoading = false;
                
                const labels = this.popularProducts.map(p => p.productName);
                const data = this.popularProducts.map(p => p.totalQuantitySold);

                this.barChartData = {
                    labels: labels,
                    datasets: [
                        { ...this.barChartData.datasets[0], data: data }
                    ]
                };
            },
            error: (err) => {
                this.toastService.show('Failed to load reports.', 'error');
                this.isLoading = false;
            }
        });
    }
}