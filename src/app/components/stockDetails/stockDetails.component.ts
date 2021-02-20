import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface PeriodicElement {
    Add?: string;
    Stock: string;
    Symbol: string;
    Name: string;
    Issuer: string;
    Sensitivity: string;
    Spread: string;
    Bid: string;
    Ask: string;
    Last: string;
    Volume: string;
    Turnover: string;
    Premium: string;
    IV: string;
    Delta: string;
    ConversionRatio: string;
    Change: string;
    ExercisePrice: string;
    ExpiryDate: string;
    CallPrice: string;
    OutStanding: string;
    Profit: string;
    Loss: string;
    Net: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        Add: 'Add',
        Stock: '700',
        Symbol: '17850',
        Name: 'BITCON@EC201E',
        Issuer: 'BI',
        Sensitivity: '1.11',
        Spread: '1',
        Bid: '0.134',
        Ask: '2.35M',
        Last: '0.123',
        Volume: '2.35M',
        Turnover: '76K',
        Premium: '26.37%',
        IV: '40.827',
        Delta: '0.431',
        ConversionRatio: '100',
        Change: '+0.019',
        ExercisePrice: '650.12',
        ExpiryDate: '2020-04-11',
        CallPrice: '3.80%',
        OutStanding: '67.15%',
        Profit: '500',
        Loss: '-200',
        Net: '300',
    },
    {
        Add: 'Add',
        Stock: '700',
        Symbol: '17850',
        Name: 'BITCON@EC201E',
        Issuer: 'BI',
        Sensitivity: '4.63',
        Spread: '-',
        Bid: '0.874',
        Ask: '0.11M',
        Last: '0.987',
        Volume: '1.65M',
        Turnover: '16K',
        Premium: '18.37%',
        IV: '40.827',
        Delta: '0.431',
        ConversionRatio: '800',
        Change: '+1.090',
        ExercisePrice: '90.12',
        ExpiryDate: '2020-01-11',
        CallPrice: '55.80%',
        OutStanding: '70.15%',
        Profit: '700',
        Loss: '-10',
        Net: '30',
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

    displayedColumns: string[] = ['Add', 'Stock', 'Symbol', 'Name', 'Issuer', 'Sensitivity', 'Spread', 'Bid', 'Ask', 'Last', 'Volume', 'Turnover', 'Premium', 'IV', 'Delta', 'ConversionRatio', 'Change', 'ExercisePrice', 'ExpiryDate', 'CallPrice', 'OutStanding', 'Profit', 'Loss', 'Net'];
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
