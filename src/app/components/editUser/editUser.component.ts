// tslint:disable: deprecation
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerListService } from '../../services/customer.service';

@Component({
    selector: 'app-edit-user',
    templateUrl: './editUser.component.html',
    styleUrls: ['./editUser.component.scss']
})

export class EditUserComponent implements OnInit, OnDestroy {

    /*
     * Private Variables
    */

    private unsubscribe$: Subject<any> = new Subject();

    /*
     * Public Variables
    */

    UserRoles: string[] = ['Super Admin', 'Admin', 'Guest', 'manager'];
    hide = true;
    hide2 = true;

    id = new FormControl();
    firstName = new FormControl();
    lastName = new FormControl();
    username = new FormControl();
    password = new FormControl();
    role = new FormControl();

    userExists = false;

    constructor(
        private route: Router,
        private customerListService: CustomerListService,
    ) { }

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
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(val => {
                console.log('val: ', val);
            });
    }

    addUser(): void {
        const body = {
            id: 0,
            firstName: this.firstName.value,
            lastName: this.lastName.value,
            username: this.username.value,
            password: this.password.value,
            role: this.role.value,
        };
        this.customerListService.addUser(body)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(val => {
                this.route.navigate(['/userList']);
            });
    }

    deleteUser(): void {
        this.customerListService.deleteUser()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(val => {
                this.route.navigate(['/userList']);
            });
    }

    /*
    * Life Cycles
    */

    ngOnInit(): void {
        this.userExists = !!this.customerListService.getUserIdSession();
        if (this.userExists) {
            this.customerListService.getUserData()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(val => {
                    this.id.setValue(val.id);
                    this.firstName.setValue(val.firstName);
                    this.lastName.setValue(val.lastName);
                    this.username.setValue(val.username);
                    this.password.setValue(val.password);
                    this.role.setValue(val.role);
                });
        }
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
