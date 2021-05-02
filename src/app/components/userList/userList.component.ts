
// tslint:disable: deprecation
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerListService } from '../../services/customer.service';
import { AuthService } from '../../services/Auth.service';

export interface UserData {
    Name: string;
    Role: string;
    Edit: string;
    'User Name'?: string;
}

const ELEMENT_DATA: UserData[] = [];

@Component({
    selector: 'app-user-list',
    templateUrl: './userList.component.html',
    styleUrls: ['./userList.component.scss']
})
export class UserListComponent implements OnInit {
    displayedColumns: string[] = ['Name', 'Role', 'Edit', 'User Name'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    data: UserData[] = ELEMENT_DATA;

    constructor(
        private route: Router,
        public customerListService: CustomerListService,
    ) { }

    ngOnInit(): void {
        this.customerListService.getUsersListData()
            .subscribe(val => {
                console.log('val: ', val);
                console.log('data: ', this.data);
                this.data = this.convertBeToFeData(val);
            });
    }

    convertBeToFeData(array: any[]): any[] {
        return array.map(ele => {
            return {
                id: ele.id,
                Name: `${ele.firstName} ${ele.lastName}`,
                Role: ele.role,
                Edit: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>',
                'User Name': ele.username,
            };
        });
    }

    clickRow(row: any): void {
        this.customerListService.setUserIdSession(row.id);
        this.route.navigate(['/editUser']);
    }
}
