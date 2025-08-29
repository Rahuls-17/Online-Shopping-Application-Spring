// File: src/app/pages/reset-password/reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../auth/login/login.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      token: ['', Validators.required], // Add token field
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Pre-fill the token if it's in the URL
    this.route.queryParams.subscribe(params => {
      const tokenFromUrl = params['token'];
      if (tokenFromUrl) {
        this.resetForm.patchValue({ token: tokenFromUrl });
      }
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const { token, newPassword } = this.resetForm.value;
      this.authService.resetPassword(token, newPassword).subscribe({
        next: (response) => {
          this.toastService.show(response.message, 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'An error occurred.', 'error');
        }
      });
    }
  }
}
