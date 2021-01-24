import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-edit-user',
    templateUrl: './editUser.component.html',
    styleUrls: ['./editUser.component.scss']
})

export class EditUserComponent implements OnInit {
    User: any = ['Super Admin', 'Admin', 'Guest'];
    hide = true;
    hide2 = true;
    constructor() { }
    ngOnInit(): void { }
}
