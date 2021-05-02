// tslint:disable: deprecation
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { AuthService } from '../../services/Auth.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
    hide = true;
    hide2 = true;

    incorrectPassword = false;

    userName = new FormControl();
    password = new FormControl();

    constructor(
        private route: Router,
        private loginService: LoginService,
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
    }

    signIn(): void {
        this.loginService.performLogin({
            username: this.userName.value,
            password: this.password.value
        })
            .subscribe(val => {
                if (val.error) {
                    this.incorrectPassword = true;
                } else {
                    this.authService.setToken(val.token);
                    this.authService.setRole(val.role);
                    this.route.navigate(['/stockDetails']);
                    this.loginService.modalIsOpen$.next('true');
                }
            });
    }

}
