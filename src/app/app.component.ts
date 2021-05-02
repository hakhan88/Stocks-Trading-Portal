// tslint:disable: deprecation
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/Auth.service';
import { LoadingService } from './services/loading.service';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    showLogin = true;
    token: string | null;

    constructor(
        private route: Router,
        private loginService: LoginService,
        private authService: AuthService,
        public loadingService: LoadingService,
    ) {
        this.loginService.modalIsOpen$
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
}
