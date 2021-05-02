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
    UserRoles: string[] = ['Super Admin', 'Admin', 'Guest', 'manager'];
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
                this.id.setValue(val.id);
                this.firstName.setValue(val.firstName);
                this.lastName.setValue(val.lastName);
                this.username.setValue(val.username);
                this.password.setValue(val.password);
                this.role.setValue(val.role);
            });
    }

    updateUserData(): void {
        const body = {
            id: this.id.value,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            username: this.username.value,
            password: this.password.value,
            role: this.role.value,
        };
        this.customerListService.updateUserData(body)
            .subscribe(val => {
                console.log('val: ', val);
            });
    }
}
