
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

    pageLength = 0;
    pageSize = 10;
    currentPageIndex = 0;

    constructor(
        private route: Router,
        public customerListService: CustomerListService,
    ) { }

    ngOnInit(): void {
        this.customerListService.getUsersListData()
            .subscribe(val => {
                this.pageLength = val.length;
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

    addUser(): void {
        this.customerListService.usSetUserIdSession();
        this.route.navigate(['/editUser']);
    }

    clickRow(row: any): void {
        this.customerListService.setUserIdSession(row.id);
        this.route.navigate(['/editUser']);
    }

    paginate(event: any): void {
        this.currentPageIndex = event.pageIndex;
        console.log('event', event);
        console.log('currentPageIndex', this.currentPageIndex);
    }

    returnPaginated(data: any[]): any[] {
        return data.slice(this.currentPageIndex * this.pageSize, this.currentPageIndex * this.pageSize + 10);
    }
}
