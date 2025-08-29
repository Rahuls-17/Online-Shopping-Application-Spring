import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, UserProfile } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      address: ['']
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (profile) => {
        if (profile) {
          this.profileForm.patchValue(profile);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.show('Failed to load profile.', 'error');
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.userService.updateProfile(this.profileForm.value).subscribe({
        next: () => {
          this.toastService.show('Profile updated successfully!', 'success');
        },
        error: () => {
          this.toastService.show('Failed to update profile.', 'error');
        }
      });
    }
  }
}