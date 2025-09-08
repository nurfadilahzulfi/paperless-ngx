import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;   // ✅ kita tambahkan supaya bisa diakses frontend
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
    permissionService: any;

  constructor(private http: HttpClient) {}

  /** 🔑 Login user */
  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/token/', { username, password }).pipe(
      tap((tokens: any) => {
        localStorage.setItem('access', tokens.access);
        localStorage.setItem('refresh', tokens.refresh);
      })
    );
  }

  /** 🚪 Logout user */
  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.currentUserSubject.next(null);
  }

  /** 👤 Ambil data user saat ini */
  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/me/').pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      })
    );
  }
  // Di document-list.component.ts, ganti methods permission:
  public canViewDocument(document?: Document): boolean {
  return this.permissionService.canViewDocument(document)
}

public canDownloadDocument(document?: Document): boolean {
  return this.permissionService.canDownloadDocument(document)
}

  /** Getter cepat */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Cek apakah superuser */
  isSuperuser(): boolean {
    return this.currentUser?.is_superuser === true;
  }
}
