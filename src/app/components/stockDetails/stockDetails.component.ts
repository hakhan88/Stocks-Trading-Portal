import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
    selector: 'app-stock-details',
    templateUrl: './stockDetails.component.html',
    styleUrls: ['./stockDetails.component.scss']
})
export class StockDetailsComponent implements OnInit {
    User: any = ['Super Admin', 'Admin', 'Guest'];
    hide = true;
    hide2 = true;
    test = '<h3>Hello</h3>';

    displayedColumns: string[] = ['Name', 'Email', 'Role', 'Edit'];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    data: PeriodicElement[] = ELEMENT_DATA;


    availableContactStatuses = [
        {
            value: 1,
            display: 'Normal'
        },
        {
            value: 1,
            display: 'Stopped Trading'
        },
        {
            value: 1,
            display: 'Waiting Listing'
        },
    ];
    availableSources = [
        {
            value: 1,
            display: 'option'
        }
    ];

    calPut = [
        { name: 'Call', completed: false, },
        { name: 'Put', completed: false, },
        { name: 'Pull', completed: false, },
        { name: 'Bear', completed: false, },
    ]

    statusFilterControl = new FormControl('');
    sourceFilter = new FormControl('');
    toppingsControl = new FormControl();
    listingDateControl = new FormControl('');
    expiryDateControl = new FormControl('');
    issuerControl = new FormControl('');
    stockControl = new FormControl('');

    checked = false;
    indeterminate = false;
    indeterminate2 = false;
    indeterminate3 = false;

    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    stockList: string[] = ['0001 CK Hutchinson', '0002 CLP Group', '0700 Tencent'];
    issuerList: string[] = ['SG', 'JP', 'UB', 'GS', 'HS'];
    expiryDateList: string[] = ['Less than 3 months', '3 months to 6 months', '6 months to 12 months', 'more than 12 months'];
    ListingDateList: string[] = ['Today', 'Tomorrow', 'Within a week', 'Past week', 'Past month'];
    // : string[] = ['', '', ''];

    constructor() { }
    ngOnInit(): void { }

    filter(): void { }

    updateAllComplete() {
    }
}
