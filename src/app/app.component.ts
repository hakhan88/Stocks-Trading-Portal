// tslint:disable: deprecation
import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './services/Auth.service';
import { LoadingService } from './services/loading.service';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    /*
     * Private Variables
    */

    private unsubscribe$: Subject<any> = new Subject();

    /*
     * Public Variables
    */

    showLogin = true;
    token: string | null;

    constructor(
        private snackBar: MatSnackBar,
        private route: Router,
        private loginService: LoginService,
        private authService: AuthService,
        public loadingService: LoadingService,
    ) {
        this.loginService.modalIsOpen$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(val => {
                if (val === 'true') {
                    this.showLogin = false;
                } else {
                    this.showLogin = true;
                }
                this.token = this.authService.getToken();
            });
        this.token = this.authService.getToken();
        this.showLogin = !!!this.token;
    }
    title = 'waren-stocks';

    logout(): void {
        this.authService.clearSessions();
        this.loginService.modalIsOpen$.next('false');
        this.route.navigate(['/signin']);
    }

    editUser(): void {
        this.route.navigate(['/userList']);
    }

    navigateTo(): void {
        if (!!this.token) {
            this.route.navigate(['/stockDetails']);
        } else {
            this.route.navigate(['/signin']);
        }
    }

    getServerStatus(): void {
        this.loginService.getStatus()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(val => {
                if (val?.totalCount < 0) {
                    this.snackBar.open('Please restart the server', 'Close', { duration: 5000 });
                } else {
                    this.snackBar.open('Server status is "OK"', 'Close', { duration: 5000 });
                }
            });
    }

    /*
    * Life Cycles
    */

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
