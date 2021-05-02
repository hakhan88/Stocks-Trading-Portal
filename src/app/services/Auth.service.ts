import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {

    setToken(token: string): void {
        sessionStorage.setItem('token', token);
    }

    getToken(): string | null {
        return sessionStorage.getItem('token');
    }

    setRole(role: string): void {
        sessionStorage.setItem('role', role);
    }

    getRole(): string | null {
        return sessionStorage.getItem('role');
    }

    clearSessions(): void {
        sessionStorage.clear();
    }

}
