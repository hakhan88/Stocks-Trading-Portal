// tslint:disable: deprecation
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { CdkDragDrop, moveItemInArray, CdkDragStart, CdkDragRelease } from '@angular/cdk/drag-drop';
import { MainUiListService } from '../../services/main-ui-list.service';
import { PageEvent } from '@angular/material/paginator';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

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

    faAngleDown = faAngleDown;
    faAngleUp = faAngleUp;

    biddingExpanded = false;
    buySellExpanded = false;

    // Pagination Related
    // MatPaginator Inputs
    pageLength = 0;
    pageSize = 20;

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
    filterFormGroup = new FormGroup({
        stockFilterControl: new FormControl(),
        stockIssuerControl: new FormControl(),
        to_call_price_from: new FormControl(),
        to_call_price_to: new FormControl(),
        conversion_ratio_from: new FormControl(),
        conversion_ration_to: new FormControl(),
        expiryDateControl: new FormControl(),
        issuerControl: new FormControl(),
        iV_from: new FormControl(),
        iV_to: new FormControl(),
        last_price_from: new FormControl(),
        last_price_to: new FormControl(),
        listingDateControl: new FormControl(),
        outstanding_from: new FormControl(),
        outstanding_to: new FormControl(),
        premium_from: new FormControl(),
        premium_to: new FormControl(),
        saveStrategyControl: new FormControl(),
        saveStrategyControlLoad: new FormControl(),
        sensitivity_from: new FormControl(),
        sensitivity_to: new FormControl(),
        sourceFilter: new FormControl(),
        spread_from: new FormControl(),
        spread_to: new FormControl(),
        square_multiple_from: new FormControl(),
        square_multiple_to: new FormControl(),
        statusFilterControl: new FormControl(),
        stockControl: new FormControl(),
        toppingsControl: new FormControl(),
        volume_from: new FormControl(),
        volume_to: new FormControl(),
        sorted_by: new FormControl(),
    });

    checked = false;
    indeterminate = false;
    indeterminate2 = false;
    indeterminate3 = false;

    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    stockList: StockIssuerListInterface[] = [];
    issuerList: string[] = [];
    expiryDateList: string[] = ['Less than 3 months', '3 months to 6 months', '6 months to 12 months', 'more than 12 months'];
    ListingDateList: string[] = ['Today', 'Tomorrow', 'Within a week', 'Past week', 'Past month'];

    sortedByOptions = [
        {
            value: '',
            display: '',
        },
        {
            value: 'DESC',
            display: 'Descending',
        },
        {
            value: 'ASC',
            display: 'Ascending',
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
            { field: 'Add', header: 'Add' },
            { field: 'CODE', header: 'CODE' },
            { field: 'TY', header: 'TY' },
            { field: 'Name', header: 'Name' },
            { field: 'ISR', header: 'ISR' },
            { field: 'SEN', header: 'SEN' },
            { field: 'SQX', header: 'SQX' },
            { field: 'BID', header: 'BID' },
            { field: 'ASK', header: 'ASK' },
            { field: 'LAST', header: 'LAST' },
            { field: 'VOL', header: 'VOL' },
            { field: 'TO', header: 'TO' },
            { field: 'PREM', header: 'PREM' },
            { field: 'IV', header: 'IV' },
            { field: 'D', header: 'D' },
            { field: 'CR', header: 'CR' },
            { field: 'CHG', header: 'CHG' },
            { field: 'K', header: 'K' },
            { field: 'EXP', header: 'EXP' },
            { field: 'CP', header: 'CP' },
            { field: 'OUT', header: 'OUT' },
            { field: 'P', header: 'P' },
            { field: 'L', header: 'L' },
            { field: 'NET', header: 'NET' },
        ];
        this.paginateData = [];
    }

    dropCol(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
        console.log('columns: ', this.columns);
    }

    mouseDown(event: any, el: any = null): void {
        el = el || event.target;
        this.pos = {
            x: el.getBoundingClientRect().left - event.clientX + 'px',
            y: el.getBoundingClientRect().top - event.clientY + 'px',
            width: el.getBoundingClientRect().width + 'px',
        };
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
    }

    filter(): void {
        this.formSubmitted = true;
        this.mainUiListService
            .getMainUiListData(this.filterFormGroup.value)
            .subscribe(val => {
                this.data = this.concertBe2FE(val.data);
                this.paginateData = this.concertBe2FE(val.data);
                this.pageLength = val.totalCount;
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
        return [];
        // return options.filter(ele => ele.name.includes(this.stockFilterControl.value) || !this.stockFilterControl.value).slice(0, 10) || [];
    }

    getIssuerListOptions(options: any[]): any[] {
        return [];
        // return options.filter(ele => ele.includes(this.stockIssuerControl.value) || !this.stockIssuerControl.value).slice(0, 10) || [];
    }

    getServerData(event: any): void {
        const bodyObject = {
            // to_call_price_from: this.to_call_price_from.value,
            // to_call_price_to: this.to_call_price_to.value,
            // conversion_ratio_from: this.conversion_ratio_from.value,
            // conversion_ratio_to: this.conversion_ration_to.value,
            // expiryDateControl: this.expiryDateControl.value,
            // issuerControl: this.issuerControl.value,
            // iV_from: this.iV_from.value,
            // iV_to: this.iV_to.value,
            // last_price_from: this.last_price_from.value,
            // last_price_to: this.last_price_to.value,
            // listingDateControl: this.listingDateControl.value,
            // outstanding_from: this.outstanding_from.value,
            // outstanding_to: this.outstanding_to.value,
            // premium_from: this.premium_from.value,
            // premium_to: this.premium_to.value,
            // sensitivity_from: this.sensitivity_from.value,
            // sensitivity_to: this.sensitivity_to.value,
            // sourceFilter: this.sourceFilter.value,
            // spread_from: this.spread_from.value,
            // spread_to: this.spread_to.value,
            // square_multiple_from: this.square_multiple_from.value,
            // square_multiple_to: this.square_multiple_to.value,
            // statusFilterControl: this.statusFilterControl.value,
            // stockControl: this.stockControl.value,
            // toppingsControl: this.toppingsControl.value,
            // volume_from: this.volume_from.value,
            // volume_to: this.volume_to.value,
        };

        this.mainUiListService
            .getMainUiListData(bodyObject, event.pageIndex * this.pageSize)
            .subscribe(val => {
                this.data = this.concertBe2FE(val.data);
                this.paginateData = this.concertBe2FE(val.data);
                this.pageLength = val.totalCount;
            });
    }

    fetchData2(array: any): any[] {
        return this.biddingExpanded ? array.slice(0, 10) : array.slice(0, 5) || [];
    }

    fetchData3(array: any): any[] {
        return this.buySellExpanded ? array.slice(0, 10) : array.slice(0, 5) || [];
    }

    biddingExpandedUpdate(): void {
        this.biddingExpanded = !this.biddingExpanded;
    }

    buySellExpandedUpdate(): void {
        this.buySellExpanded = !this.buySellExpanded;
    }

    saveLayout(): void {
        // document.cookie = `${this.saveStrategyControl.value}=${JSON.stringify(this.columns)}`;
    }

    loadStrategy(): void {
        // const loadedColumn = this.getCookie(this.saveStrategyControlLoad.value);
        // if (loadedColumn) {
        //     this.columns = JSON.parse(loadedColumn);
        // }
    }

    strategyList(): string[] {
        const allCookies = this.listCookies();
        return Object.keys(allCookies);
    }

    getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts && parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return;
    }

    listCookies(): object {
        return document.cookie.split(';').reduce((cookies, cookie) => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            return { ...cookies, [name]: value };
        }, {});
    }
}
