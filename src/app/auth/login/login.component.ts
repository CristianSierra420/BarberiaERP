import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Barberia } from '../../core/models/barberia.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  barberia: Barberia | null = null;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.buildForm();
    this.loadBarberia();
  }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  private loadBarberia(): void {
    // En produccion esto se resuelve por subdominio o parametro en la URL
    // Ejemplo: elestilo.barbersystem.co => se consulta la API con slug "elestilo"
    this.authService.getBarberiaBySlug('elestilo').subscribe({
      next: (data: Barberia) => this.barberia = data,
      error: () => {
        // Fallback: barberia por defecto si no se encuentra
        this.barberia = {
          id: 0,
          nombre: 'Barbería',
          ciudad: '',
          logoUrl: null,
          slug: ''
        };
      }
    });
  }

  get emailCtrl() { return this.loginForm.get('email')!; }
  get passwordCtrl() { return this.loginForm.get('password')!; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, remember } = this.loginForm.value;

    this.authService.login({ email, password, remember }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.status === 401
          ? 'Correo o contraseña incorrectos.'
          : 'Ocurrió un error. Intenta de nuevo.';
      }
    });
  }

  onLoginWhatsApp(): void {
    // Aqui se abrira flujo de autenticacion por WhatsApp (OTP)
    this.router.navigate(['/auth/whatsapp']);
  }

  cambiarBarberia(): void {
    this.router.navigate(['/auth/seleccionar-barberia']);
  }

  getInitiales(): string {
    if (!this.barberia?.nombre) return 'B';
    return this.barberia.nombre
      .split(' ')
      .slice(0, 2)
      .map((w: string) => w[0])
      .join('')
      .toUpperCase();
  }
}