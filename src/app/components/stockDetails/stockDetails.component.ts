import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {
    Add?: string;
    Stock: string;
    Symbol: string;
    Name: string;
    Issuer: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        Symbol: 'George@gmail.com', Stock: 'Hydrogen', Name: 'Admin', Issuer: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>', Add: 'Add'
    },
    {
        Symbol: 'Ford@gmail.com', Stock: 'Helium', Name: 'Admin', Issuer: '<mat-icon matSuffix class="mat-icon notranslate material-icons mat-icon-no-color">edit</mat-icon>', Add: 'Add'
    },
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

    displayedColumns: string[] = ['Add', 'Stock', 'Symbol', 'Name', 'Issuer'];
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
