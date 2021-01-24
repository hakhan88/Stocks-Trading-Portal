import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
    User: any = ['Super Admin', 'Author', 'Reader'];
    hide = true;
    hide2 = true;
    constructor() { }
    ngOnInit(): void { }
}
