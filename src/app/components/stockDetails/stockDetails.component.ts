// tslint:disable: deprecation
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';

import { CdkDragDrop, moveItemInArray, CdkDragStart, CdkDragRelease } from '@angular/cdk/drag-drop';
import { MainUiListService } from '../../services/main-ui-list.service';
import { PageEvent } from '@angular/material/paginator';


interface StockIssuerListInterface {
    symbol: number;
    name: string;
    symbolName: string;
}

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

const ELEMENT_DATA: PeriodicElement[] = [];
interface PeriodicElement2 {
    Bid: string;
    Ask: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [];

const ELEMENT_DATA3: PeriodicElement2[] = [];

@Component({
    selector: 'app-stock-details',
    templateUrl: './stockDetails.component.html',
    styleUrls: ['./stockDetails.component.scss']
})
export class StockDetailsComponent implements OnInit {

    // Pagination Related
    // MatPaginator Inputs
    pageLength = 0;
    pageSize = 10;

    // MatPaginator Output
    pageEvent: PageEvent | undefined;

    SymbolSelected: string | undefined;
    NameSelected: string | undefined;

    formSubmitted = false;

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
    stockFilterControl = new FormControl();
    stockIssuerControl = new FormControl();
    callPriceFrom = new FormControl();
    callPriceTo = new FormControl();
    conversionRatioFrom = new FormControl();
    conversionRatioTo = new FormControl();
    expiryDateControl = new FormControl();
    issuerControl = new FormControl();
    ivFrom = new FormControl();
    ivTo = new FormControl();
    lastPriceFrom = new FormControl();
    lastPriceTo = new FormControl();
    listingDateControl = new FormControl();
    outStandingFrom = new FormControl();
    outStandingTo = new FormControl();
    premiumFrom = new FormControl();
    premiumTo = new FormControl();
    saveStrategyControl = new FormControl();
    sensitivityFrom = new FormControl();
    sensitivityTo = new FormControl();
    sourceFilter = new FormControl();
    spreadFrom = new FormControl();
    spreadTo = new FormControl();
    squareMultipleFrom = new FormControl();
    squareMultipleTo = new FormControl();
    statusFilterControl = new FormControl();
    stockControl = new FormControl();
    toppingsControl = new FormControl();
    volumeFrom = new FormControl();
    volumeTo = new FormControl();


    checked = false;
    indeterminate = false;
    indeterminate2 = false;
    indeterminate3 = false;

    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    stockList: StockIssuerListInterface[] = [];
    issuerList: string[] = [];
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

    displayedColumns3: string[] = ['Ask', 'Bid'];
    columnsToDisplay3: string[] = this.displayedColumns3.slice();
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

        this.mainUiListService
            .getStockListData(this.sampleBody)
            .subscribe(val => {
                this.stockList = val;
            });

        this.mainUiListService
            .getIssuerListData(this.sampleBody)
            .subscribe(val => {
                this.issuerList = val;
            });

        setInterval(() => {
            // if (this.formSubmitted) {
            //     this.filter();
            // }
        }, 60000);
    }

    filter(): void {
        this.formSubmitted = true;
        // tslint:disable: object-literal-shorthand
        const bodyObject = {
            to_call_price_from: this.callPriceFrom.value,
            to_call_price_to: this.callPriceTo.value,
            conversion_ratio_from: this.conversionRatioFrom.value,
            conversion_ratio_to: this.conversionRatioTo.value,
            expiryDateControl: this.expiryDateControl.value,
            issuerControl: this.issuerControl.value,
            iV_from: this.ivFrom.value,
            iV_to: this.ivTo.value,
            last_price_from: this.lastPriceFrom.value,
            last_price_to: this.lastPriceTo.value,
            listingDateControl: this.listingDateControl.value,
            outstanding_from: this.outStandingFrom.value,
            outstanding_to: this.outStandingTo.value,
            premium_from: this.premiumFrom.value,
            premium_to: this.premiumTo.value,
            saveStrategyControl: this.saveStrategyControl.value,
            sensitivity_from: this.sensitivityFrom.value,
            sensitivity_to: this.sensitivityTo.value,
            sourceFilter: this.sourceFilter.value,
            spread_from: this.spreadFrom.value,
            spread_to: this.spreadTo.value,
            square_multiple_from: this.squareMultipleFrom.value,
            square_multiple_to: this.squareMultipleTo.value,
            statusFilterControl: this.statusFilterControl.value,
            stockControl: this.stockControl.value,
            toppingsControl: this.toppingsControl.value,
            volume_from: this.volumeFrom.value,
            volume_to: this.volumeTo.value,
        };

        this.mainUiListService
            .getMainUiListData(bodyObject)
            .subscribe(val => {
                this.data = this.concertBe2FE(val);
                this.pageLength = val.length;
            });
    }

    concertBe2FE(array: any): any[] {
        const mappedToFe: any[] = [];
        array.forEach((ele: { [x: string]: any; }) => {
            const mapObject = {
                ASK: ele.ask,
                Add: `<a href="hkex://ec2-18-162-51-206.ap-east-1.compute.amazonaws.com/warren/stockDetails?triggeradd=${ele.symbol}">Add</a>`,
                BID: ele.bid,
                CHG: ele.change,
                CODE: ele.symbol,
                CP: ele.call_Price,
                CR: ele.conversion_Ratio,
                D: ele.delta,
                EXP: ele.expiry_Date,
                ISR: ele.issuer,
                IV: ele.iv,
                K: ele.exercise_Price,
                L: ele.loss,
                LAST: ele.last,
                NET: ele.net,
                Name: ele.name,
                OUT: ele.outstanding_Qty,
                P: ele.profit,
                PREM: ele.premium,
                SEN: ele.sensitivity,
                SPRD: ele.spread,
                SQX: ele.square_Multiple,
                STK: ele.stock,
                TO: ele.turnover,
                TY: ele.type,
                VOL: ele.volume,
            };
            mappedToFe.push(mapObject);
        });
        return mappedToFe;
    }

    concertTransaction2FE(array: any): any[] {
        const arrowUp = '<div style=\"width: 0px !important;border-left: 7px dotted transparent !important;border-right: 7px solid transparent !important;border-bottom: 15px solid green !important;float: right;"></div>';
        const arrowDown = '<div style=\"width: 0px !important;border-left: 7px dotted transparent !important;border-right: 7px solid transparent !important;border-top: 15px solid #ff0000 !important;float: right;"></div>';
        const mappedToFe: any[] = [];
        array.forEach((ele: { [x: string]: any; }) => {
            const showArrow = ele.buySell === 'B' ? arrowUp : arrowDown;
            const mapObject = {
                Ask: ele.time,
                Bid: `${ele.price}
                    ${showArrow}`,
            };
            mappedToFe.push(mapObject);
        });
        return mappedToFe;
    }

    concertBidList2FE(array: any): any[] {
        const mappedToFe: any[] = [];
        array.forEach((ele: { [x: string]: any; }) => {
            const mapObject = {
                Ask: ele.ask_Price,
                Bid: ele.bid_Price,
            };
            mappedToFe.push(mapObject);
        });
        return mappedToFe;
    }

    rowClicked(element: PeriodicElement): void {
        this.SymbolSelected = element.CODE;
        this.NameSelected = element.Name;
        this.mainUiListService
            .getAskBidListData(element.CODE)
            .subscribe(getAskBidListDataVal => {
                this.data2 = this.concertBidList2FE(getAskBidListDataVal);
            });
        this.mainUiListService
            .getTransactionLogListData(element.CODE)
            .subscribe(getTransactionLogListDataVal => {
                this.data3 = this.concertTransaction2FE(getTransactionLogListDataVal);
            });
    }

    getStockListOptions(options: any[]): any[] {
        return options.filter(ele => ele.name.includes(this.stockFilterControl.value) || !this.stockFilterControl.value).slice(0, 10) || [];
    }

    getIssuerListOptions(options: any[]): any[] {
        return options.filter(ele => ele.includes(this.stockIssuerControl.value) || !this.stockIssuerControl.value).slice(0, 10) || [];
    }

    getServerData(event: any): void {
        console.log('getServerData', event.pageIndex);

        const bodyObject = {
            to_call_price_from: this.callPriceFrom.value,
            to_call_price_to: this.callPriceTo.value,
            conversion_ratio_from: this.conversionRatioFrom.value,
            conversion_ratio_to: this.conversionRatioTo.value,
            expiryDateControl: this.expiryDateControl.value,
            issuerControl: this.issuerControl.value,
            iV_from: this.ivFrom.value,
            iV_to: this.ivTo.value,
            last_price_from: this.lastPriceFrom.value,
            last_price_to: this.lastPriceTo.value,
            listingDateControl: this.listingDateControl.value,
            outstanding_from: this.outStandingFrom.value,
            outstanding_to: this.outStandingTo.value,
            premium_from: this.premiumFrom.value,
            premium_to: this.premiumTo.value,
            saveStrategyControl: this.saveStrategyControl.value,
            sensitivity_from: this.sensitivityFrom.value,
            sensitivity_to: this.sensitivityTo.value,
            sourceFilter: this.sourceFilter.value,
            spread_from: this.spreadFrom.value,
            spread_to: this.spreadTo.value,
            square_multiple_from: this.squareMultipleFrom.value,
            square_multiple_to: this.squareMultipleTo.value,
            statusFilterControl: this.statusFilterControl.value,
            stockControl: this.stockControl.value,
            toppingsControl: this.toppingsControl.value,
            volume_from: this.volumeFrom.value,
            volume_to: this.volumeTo.value,
        };

        this.mainUiListService
            .getMainUiListData(bodyObject, event.pageIndex + 1)
            .subscribe(val => {
                this.data = this.concertBe2FE(val);
                this.pageLength = val.length;
            });
    }
}
