import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { UserProfile } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  users: UserProfile[] = [];
  adminCount = 0;
  
  constructor(
    private adminService: AdminService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe(data => {
        this.users = data;
        this.adminCount = this.users.filter(u => u.role === 'ADMIN').length;
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.toastService.show('User deleted successfully!', 'success');
          this.loadUsers();
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'Failed to delete user.', 'error');
        }
      });
    }
  }

  onRoleChange(userId: number, newRole: string): void {
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.toastService.show('User role updated successfully!', 'success');
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to update role.', 'error');
        this.loadUsers();
      }
    });
  }

  toggleStatus(userId: number): void {
    this.adminService.toggleUserStatus(userId).subscribe({
      next: () => {
        this.toastService.show('User status updated successfully!', 'success');
        this.loadUsers();
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to update status.', 'error');
      }
    });
  }
}