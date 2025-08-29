import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../../auth/login/login.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.valid) {
      this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
        next: (response) => {
          this.toastService.show(response.message, 'success');
          this.router.navigate(['/reset-password']); 
        },
        error: (err) => {
          this.toastService.show(err.error?.message || 'An error occurred.', 'error');
        }
      });
    }
  }
}
