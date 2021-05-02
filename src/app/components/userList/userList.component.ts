
// tslint:disable: deprecation
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerListService } from '../../services/customer.service';
import { AuthService } from '../../services/Auth.service';

export interface PeriodicElement {
    Name: string;
    Email: string;
    Role: string;
    Edit: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    { Email: 'George@gmail.com', Name: 'Hydrogen', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Ford@gmail.com', Name: 'Helium', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Anna@gmail.com', Name: 'Lithium', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Joshua@gmail.com', Name: 'Beryllium', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Hannah@gmail.com', Name: 'Boron', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Martha@gmail.com', Name: 'Carbon', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Mark@gmail.com', Name: 'Nitrogen', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Henry@gmail.com', Name: 'Oxygen', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Luke@gmail.com', Name: 'Fluorine', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
    { Email: 'Joseph@gmail.com', Name: 'Neon', Role: 'Admin', Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>' },
];

@Component({
    selector: 'app-user-list',
    templateUrl: './userList.component.html',
    styleUrls: ['./userList.component.scss']
})
export class UserListComponent implements OnInit {
    User: any = ['Super Admin', 'Admin', 'Guest'];
    hide = true;
    hide2 = true;
    test = '<h3>Hello</h3>';

    displayedColumns: string[] = ['Name', 'Email', 'Role', 'Edit'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    data: PeriodicElement[] = ELEMENT_DATA;


    constructor(
        private route: Router,
        public customerListService: CustomerListService,
    ) {
    }
    ngOnInit(): void {
        this.customerListService.getUsersListData()
            .subscribe(val => {
                console.log('val: ', val);
            });
    }

    clickRow(row: any): void {
        console.log(row);
        this.route.navigate(['/editUser']);
    }
}
