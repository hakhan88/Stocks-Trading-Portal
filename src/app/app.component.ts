import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    showLogin = true;
    constructor(
        private route: Router,
        private loginService: LoginService,
    ) {
        this.loginService.modalIsOpen$.subscribe(val => {
            if (val === 'true') {
                this.showLogin = false;
            } else {
                this.showLogin = true;
            }
        });
    }
    title = 'waren-stocks';

    logout(): void {
        this.loginService.modalIsOpen$.next('false');
        this.route.navigate(['/signin']);
    }
}
