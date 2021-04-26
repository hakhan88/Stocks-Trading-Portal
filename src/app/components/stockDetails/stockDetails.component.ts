import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CdkDragDrop, moveItemInArray, CdkDragStart, CdkDragRelease } from '@angular/cdk/drag-drop';
import { MainUiListService } from '../../services/main-ui-list.service';

export interface PeriodicElement {
    Add?: string;
    STK: string;
    CODE: string;
    Name: string;
    ISR: string;
    SEN: string;
    SPRD: string;
    SQX: string;
    TY: string;
    BID: string;
    ASK: string;
    LAST: string;
    VOL: string;
    TO: string;
    PREM: string;
    IV: string;
    D: string;
    CR: string;
    CHG: string;
    K: string;
    EXP: string;
    CP: string;
    OUT: string;
    P: string;
    L: string;
    NET: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
    {
        Add: 'Add',
        STK: '700',
        CODE: '17850',
        Name: 'BITCON@EC201E',
        ISR: 'BI',
        SEN: '1.11',
        SPRD: '1',
        SQX: 'SQX',
        TY: 'Call',
        BID: '0.134',
        ASK: '2.35M',
        LAST: '0.123',
        VOL: '2.35M',
        TO: '76K',
        PREM: '26.37%',
        IV: '40.827',
        D: '0.431',
        CR: '100',
        CHG: '+0.019',
        K: '650.12',
        EXP: '2020-04-11',
        CP: '3.80%',
        OUT: '67.15%',
        P: '500',
        L: '-200',
        NET: '300',
    },
    {
        Add: 'Add',
        STK: '700',
        CODE: '17850',
        Name: 'BITCON@EC201E',
        ISR: 'BI',
        SEN: '4.63',
        SQX: 'SQX',
        TY: 'Put',
        SPRD: '-',
        BID: '0.874',
        ASK: '0.11M',
        LAST: '0.987',
        VOL: '1.65M',
        TO: '16K',
        PREM: '18.37%',
        IV: '40.827',
        D: '0.431',
        CR: '800',
        CHG: '+1.090',
        K: '90.12',
        EXP: '2020-01-11',
        CP: '55.80%',
        OUT: '70.15%',
        P: '700',
        L: '-10',
        NET: '30',
    },
];
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

    displayedColumns: string[] = [
        'Add',
        'CODE',
        'TY',
        'Name',
        'ISR',
        'SEN',
        'SQX',
        'BID',
        'ASK',
        'LAST',
        'VOL',
        'TO',
        'PREM',
        'IV',
        'D',
        'CR',
        'CHG',
        'K',
        'EXP',
        'CP',
        'OUT',
        'P',
        'L',
        'NET',
    ];
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
    ];

    // All Form controls
    statusFilterControl = new FormControl('');
    sourceFilter = new FormControl('');
    toppingsControl = new FormControl();
    listingDateControl = new FormControl('');
    expiryDateControl = new FormControl('');
    issuerControl = new FormControl('');
    stockControl = new FormControl('');
    saveStrategyControl = new FormControl('');
    lastPriceFrom = new FormControl('');
    lastPriceTo = new FormControl('');
    outStandingFrom = new FormControl('');
    outStandingTo = new FormControl('');
    conversionRatioFrom = new FormControl('');
    conversionRatioTo = new FormControl('');
    ivFrom = new FormControl('');
    ivTo = new FormControl('');
    volumeFrom = new FormControl('');
    volumeTo = new FormControl('');
    premiumFrom = new FormControl('');
    premiumTo = new FormControl('');
    callPriceFrom = new FormControl('');
    callPriceTo = new FormControl('');
    sensitivityFrom = new FormControl('');
    sensitivityTo = new FormControl('');
    spreadFrom = new FormControl('');
    spreadTo = new FormControl('');
    squareMultipleFrom = new FormControl('');
    squareMultipleTo = new FormControl('');


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

    sampleBody = {
        last_price_from: 0,
        last_price_to: 0,
        outstanding_from: 0,
        outstanding_to: 0,
        conversion_ratio_from: 0,
        conversion_ration_to: 0,
        iV_from: 0,
        iV_to: 0,
        volume_from: 0,
        volume_to: 0,
        premium_from: 0,
        premium_to: 0,
        to_call_price_from: 0,
        to_call_price_to: 0,
        sensitivity_from: 0,
        sensitivity_to: 0,
        spread_from: 0,
        spread_to: 0,
        square_multiple_from: 0,
        square_multiple_to: 0
    };

    displayedColumns2: string[] = ['Bid', 'Ask'];
    columnsToDisplay2: string[] = this.displayedColumns2.slice();
    data2: any[] = ELEMENT_DATA2;

    displayedColumns3: string[] = ['Bid', 'Ask'];
    columnsToDisplay3: string[] = ['Bid', 'Ask'];
    data3: any[] = ELEMENT_DATA3;

    /*
        draggable related stuff
    */

    columns: any[] = [];
    paginateData: any[] = [];
    pos: any;
    release = true;

    setDraggableData(): void {
        this.columns = [
            { field: '_id', header: 'Id' },
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'Address', header: 'Address' },
            { field: 'street', header: 'Street' },
            { field: 'city', header: 'City' },
            { field: 'state', header: 'State' }
        ];
        this.paginateData = [{
            id: '1',
            firstName: 'Becker',
            lastName: 'Glenn',
            Address: 626,
            street: 'Keap Street',
            city: 'Oceola',
            state: 'Tennessee'
        },
        {
            id: '2',
            firstName: 'Kellie',
            lastName: 'Moody',
            Address: 426,
            street: 'Windsor Place',
            city: 'Condon',
            state: 'Minnesota'
        }
        ];
    }

    dropRow(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.paginateData, event.previousIndex, event.currentIndex);
    }
    dropCol(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }
    mouseDown(event: any, el: any = null): void {
        el = el || event.target;
        this.pos = {
            x: el.getBoundingClientRect().left - event.clientX + 'px',
            y: el.getBoundingClientRect().top - event.clientY + 'px',
            width: el.getBoundingClientRect().width + 'px',
        };
    }
    onDragRelease(event: CdkDragRelease): void {
        this.renderer2.setStyle(event.source.element.nativeElement, 'margin-left', '0px');
    }

    constructor(
        public renderer2: Renderer2,
        public mainUiListService: MainUiListService,
    ) { }

    ngOnInit(): void {
        this.setDraggableData();
        this.mainUiListService.getMainUiListData(this.sampleBody)
            // tslint:disable-next-line: deprecation
            .subscribe(val => {
                console.log(val);
            });
    }

    filter(): void { }

    updateAllComplete(): void {
    }
}
