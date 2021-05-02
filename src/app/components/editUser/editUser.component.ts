// tslint:disable: deprecation
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomerListService } from '../../services/customer.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './editUser.component.html',
    styleUrls: ['./editUser.component.scss']
})

export class EditUserComponent implements OnInit {
    User: any = ['Super Admin', 'Admin', 'Guest'];
    hide = true;
    hide2 = true;

    id = new FormControl();
    firstName = new FormControl();
    lastName = new FormControl();
    username = new FormControl();
    password = new FormControl();
    role = new FormControl();

    constructor(
        private customerListService: CustomerListService,
    ) { }

    ngOnInit(): void {
        this.customerListService.getUserData()
            .subscribe(val => {
                console.log(val);
            });
    }

    updateUserData(): void {
        console.log('updateUserData');
    }
}
