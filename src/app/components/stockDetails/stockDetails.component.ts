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
    SquareMultiple: string;
    Type: string;
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

interface PeriodicElement2 {
    Bid: string;
    Ask: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
    {
        Bid: '0.23 6M (2)',
        Ask: '0.12 7M (2)'
    },
    {
        Bid: '0.23 6M (2)',
        Ask: '0.12 7M (2)'
    },
    {
        Bid: '0.23 6M (2)',
        Ask: '0.12 7M (2)'
    },
    {
        Bid: '0.23 6M (2)',
        Ask: '0.12 7M (2)'
    },
    {
        Bid: '0.23 6M (2)',
        Ask: '0.12 7M (2)'
    }
];

const ELEMENT_DATA3: PeriodicElement2[] = [
    {
        Bid: '09:35:48',
        Ask: '0.1345 <div style=\"width: 5px !important;border-left: 7px dotted transparent !important;border-right: 7px solid transparent !important;border-bottom: 15px solid green !important;float: right;"></div>'
    },
    {
        Bid: '09:45:53',
        Ask: '0.1345 <div style=\"width: 5px !important;border-left: 7px dotted transparent !important;border-right: 7px solid transparent !important;border-bottom: 15px solid green !important;float: right;"></div>'
    },
    {
        Bid: '10:01:10',
        Ask: '0.1345 <div style=\"width: 5px !important;border-left: 7px dotted transparent !important;border-right: 7px solid transparent !important;border-bottom: 15px solid green !important;float: right;"></div>'
    },
    {
        Bid: '10:01:11',
        Ask: '0.1345 <div style=\"width: 5px !important;border-left: 7px dotted transparent !important;border-right: 7px solid transparent !important;border-bottom: 15px solid green !important;float: right;"></div>'
    },
];

const ELEMENT_DATA: PeriodicElement[] = [
    {
        Add: 'Add',
        Stock: '700',
        Symbol: '17850',
        Name: 'BITCON@EC201E',
        Issuer: 'BI',
        Sensitivity: '1.11',
        Spread: '1',
        SquareMultiple: 'SQX',
        Type: 'Call',
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
        SquareMultiple: 'SQX',
        Type: 'Put',
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

    displayedColumns: string[] = ['Add', 'Stock', 'Symbol', 'Name', 'Issuer', 'Sensitivity', 'Spread', 'SquareMultiple', 'Bid', 'Ask', 'Last', 'Volume', 'Turnover', 'Premium', 'IV', 'Delta', 'ConversionRatio', 'Change', 'ExercisePrice', 'ExpiryDate', 'CallPrice', 'OutStanding', 'Profit', 'Loss', 'Net'];
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

    saveStrategyControl = new FormControl('');

    checked = false;
    indeterminate = false;
    indeterminate2 = false;
    indeterminate3 = false;

    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    stockList: string[] = ['0001 CK Hutchinson', '0002 CLP Group', '0700 Tencent'];
    issuerList: string[] = ['SG', 'JP', 'UB', 'GS', 'HS'];
    expiryDateList: string[] = ['Less than 3 months', '3 months to 6 months', '6 months to 12 months', 'more than 12 months'];
    ListingDateList: string[] = ['Today', 'Tomorrow', 'Within a week', 'Past week', 'Past month'];

    strategyList: string[] = ['Strategy 1', 'Strategy 2', 'Strategy 3', 'Strategy 4'];
    sortedByOptions = [
        {
            value: 1,
            display: 'Issuer',
        },
        {
            value: 1,
            display: 'Sensitivity',
        },
        {
            value: 1,
            display: 'spread',
        },
        {
            value: 1,
            display: 'Square spread',
        },
        {
            value: 1,
            display: 'Bid',
        },
        {
            value: 1,
            display: 'Ask',
        },
        {
            value: 1,
            display: 'Last',
        },
        {
            value: 1,
            display: 'Volume',
        },
        {
            value: 1,
            display: 'Premium',
        },
        {
            value: 1,
            display: 'IV',
        },
        {
            value: 1,
            display: 'Delta',
        },
        {
            value: 1,
            display: 'Turnover',
        },
    ];


    displayedColumns2: string[] = ['Bid', 'Ask'];
    columnsToDisplay2: string[] = this.displayedColumns2.slice();
    data2: any[] = ELEMENT_DATA2;

    displayedColumns3: string[] = ['Bid', 'Ask'];
    columnsToDisplay3: string[] = ['Bid', 'Ask'];
    data3: any[] = ELEMENT_DATA3;

    constructor() { }
    ngOnInit(): void { }

    filter(): void { }

    updateAllComplete() {
    }
}
