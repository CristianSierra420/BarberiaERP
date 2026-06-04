import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Barberia } from '../models/barberia.model';

export interface LoginRequest {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'BARBERO' | 'RECEPCION';
    barberiaId: number;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'bs_token';
  private readonly REFRESH_KEY = 'bs_refresh';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(res => this.saveSession(res, credentials.remember))
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return (
      localStorage.getItem(this.TOKEN_KEY) ||
      sessionStorage.getItem(this.TOKEN_KEY)
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getBarberiaBySlug(slug: string): Observable<Barberia> {
    return this.http.get<Barberia>(
      `${environment.apiUrl}/barberias/slug/${slug}`
    );
  }

  private saveSession(res: LoginResponse, remember: boolean): void {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, res.token);
    storage.setItem(this.REFRESH_KEY, res.refreshToken);
  }
}
