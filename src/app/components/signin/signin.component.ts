import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
    hide = true;
    hide2 = true;
    constructor(
        private route: Router,
        private loginService: LoginService,
    ) { }

    ngOnInit(): void {
    }

    signIn(): void {
        this.loginService.modalIsOpen$.next('true');
        this.route.navigate(['/stockDetails']);
    }

}
