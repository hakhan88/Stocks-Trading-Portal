import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpInterceptor,
    HttpResponse,
    HttpEvent
} from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { Observable } from 'rxjs';
import { AuthService } from './Auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private totalRequests = 0;

    constructor(
        private loadingService: LoadingService,
        private authService: AuthService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
                Accept: 'application/json',
                Authorization: `Bearer ${this.authService.getToken()}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
        return next.handle(req);
    }
}
