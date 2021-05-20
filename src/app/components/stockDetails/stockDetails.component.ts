// tslint:disable: deprecation
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MainUiListService } from '../../services/main-ui-list.service';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

interface StockIssuerListInterface {
    symbol: number;
    name: string;
    symbolName: string;
}

interface ValueDescriptionInterface {
    value: number | string;
    description: string;
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
interface BidAskInterface {
    Bid: string;
    Ask: string;
}

const BIDDING_ELEMENT_DATA: BidAskInterface[] = [];
const TRANSACTION_LOG_DATA: BidAskInterface[] = [];

@Component({
    selector: 'app-stock-details',
    templateUrl: './stockDetails.component.html',
    styleUrls: ['./stockDetails.component.scss']
})
export class StockDetailsComponent implements OnInit {

    /*
     * Private Variables
    */

    private defaultValuesToBe = {
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

    /*
     * Public Variables
    */

    // icons for the accordion
    faAngleDown = faAngleDown;
    faAngleUp = faAngleUp;

    // set up for the two accordions
    biddingExpanded = false;
    buySellExpanded = false;

    // Pagination Related
    // MatPaginator Inputs
    pageLength = 0;
    pageSize = 20;

    // MatPaginator Output
    // pageEvent: PageEvent | undefined; // TODO

    // left filter set up for selection
    SymbolSelected: string | undefined;
    NameSelected: string | undefined;

    // need the following for the calling of data every constant interval to show current updated data
    formSubmitted = false;

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

    availableContactStatuses = [ // TODO get values from cham on this
        {
            value: 1,
            display: 'Normal'
        },
        {
            value: 2,
            display: 'Stopped Trading'
        },
        {
            value: 3,
            display: 'Waiting Listing'
        },
    ];

    typesOfFiltering: ValueDescriptionInterface[] = [
        { value: 'call', description: 'call' },
        { value: 'put', description: 'put' },
        { value: 'bull', description: 'bull' },
        { value: 'bear', description: 'bear' },
    ];

    // tslint:disable-next-line: typedef
    updateChkbxArray(chk: { value: string | number; description: string; }, isChecked: any, key: any) {
        const chkArray = this.filterFormGroup.get(key) as FormArray;
        if (isChecked) {
            if (chkArray.controls.findIndex(x => x.value === chk.value) === -1) {
                chkArray.push(new FormControl(chk.value));
            }
        } else {
            const idx = chkArray.controls.findIndex(x => x.value === chk.value);
            chkArray.removeAt(idx);
        }
    }

    // All Form controls
    // tslint:disable: member-ordering
    filterFormGroup = new FormGroup({
        conversion_ratio_from: new FormControl(),
        conversion_ration_to: new FormControl(),
        expiry_date: new FormControl(),
        issuer: new FormControl(),
        iV_from: new FormControl(),
        iV_to: new FormControl(),
        last_price_from: new FormControl(),
        last_price_to: new FormControl(),
        listing_date: new FormControl(),
        outstanding_from: new FormControl(),
        outstanding_to: new FormControl(),
        premium_from: new FormControl(),
        premium_to: new FormControl(),
        saveStrategyControl: new FormControl(),
        saveStrategyControlLoad: new FormControl(),
        sensitivity_from: new FormControl(),
        sensitivity_to: new FormControl(),
        sorted_by: new FormControl(),
        sourceFilter: new FormControl(),
        spread_from: new FormControl(),
        spread_to: new FormControl(),
        square_multiple_from: new FormControl(),
        square_multiple_to: new FormControl(),
        status: new FormControl(),
        symbol: new FormControl(),
        stockFilterControl: new FormControl(),
        stockIssuerControl: new FormControl(),
        to_call_price_from: new FormControl(),
        to_call_price_to: new FormControl(),
        toppingsControl: new FormControl(),
        type: this.fb.array([]),
        volume_from: new FormControl(),
        volume_to: new FormControl(),
    });

    checked = false;
    stockList: StockIssuerListInterface[] = [];
    issuerList: string[] = [];

    expiryDateList: ValueDescriptionInterface[] = [
        { value: 1, description: 'Less than 3 months' },
        { value: 2, description: '3 months to 6 months' },
        { value: 3, description: '6 months to 12 months' },
        { value: 4, description: 'more than 12 months' },
    ];

    ListingDateList: ValueDescriptionInterface[] = [
        { value: 1, description: 'Today' },
        { value: 2, description: 'Tomorrow' },
        { value: 3, description: 'Within a week' },
        { value: 4, description: 'Past week' },
        { value: 5, description: 'Past month' },
    ];

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

    displayedColumns2: string[] = ['Bid', 'Ask'];
    columnsToDisplay2: string[] = this.displayedColumns2.slice();
    biddingListData: any[] = BIDDING_ELEMENT_DATA;

    displayedColumns3: string[] = ['Ask', 'Bid'];
    columnsToDisplay3: string[] = this.displayedColumns3.slice();
    transactionLogs: any[] = TRANSACTION_LOG_DATA;

    /*
      * Draggable related stuff
    */

    columns: any[] = [];
    paginateData: any[] = [];
    pos: any;
    release = true;

    constructor(
        public renderer2: Renderer2,
        public mainUiListService: MainUiListService,
        public fb: FormBuilder,
    ) {
        setTimeout(() => {
            console.log('controls: ', this.filterFormGroup.controls);
        }, 4000);
    }

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
    }

    mouseDown(event: any, el: any = null): void {
        el = el || event.target;
        this.pos = {
            x: el.getBoundingClientRect().left - event.clientX + 'px',
            y: el.getBoundingClientRect().top - event.clientY + 'px',
            width: el.getBoundingClientRect().width + 'px',
        };
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

    convertTransaction2FE(array: any): any[] {
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

    convertBidList2FE(array: any): any[] {
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
                this.biddingListData = this.convertBidList2FE(getAskBidListDataVal);
            });
        this.mainUiListService
            .getTransactionLogListData(element.CODE)
            .subscribe(getTransactionLogListDataVal => {
                this.transactionLogs = this.convertTransaction2FE(getTransactionLogListDataVal);
            });
    }

    getStockListOptions(options: any[]): any[] {
        return options.filter(ele => ele.name.includes(this.filterFormGroup.value.stockFilterControl)
            || !this.filterFormGroup.value.stockFilterControl).slice(0, 10) || [];
    }

    getIssuerListOptions(options: any[]): any[] {
        return options.filter(ele => ele.includes(this.filterFormGroup.value.stockIssuerControl)
            || !this.filterFormGroup.value.sstockIssuerControl).slice(0, 10) || [];
    }

    getServerData(event: any): void {
        this.mainUiListService
            .getMainUiListData(this.filterFormGroup.value, event.pageIndex * this.pageSize)
            .subscribe(val => {
                this.data = this.concertBe2FE(val.data);
                this.paginateData = this.concertBe2FE(val.data);
                this.pageLength = val.totalCount;
            });
    }

    fetchBiddingData(array: any): any[] {
        return this.biddingExpanded ? array.slice(0, 10) : array.slice(0, 5) || [];
    }

    fetchBuySellData(array: any): any[] {
        return this.buySellExpanded ? array.slice(0, 10) : array.slice(0, 5) || [];
    }

    biddingExpandedUpdate(): void {
        this.biddingExpanded = !this.biddingExpanded;
    }

    buySellExpandedUpdate(): void {
        this.buySellExpanded = !this.buySellExpanded;
    }

    saveLayout(): void {
        document.cookie = `${this.filterFormGroup.value.saveStrategyControl.value}=${JSON.stringify(this.columns)}`;
    }

    loadStrategy(): void {
        const loadedColumn = this.getCookie(this.filterFormGroup.value.saveStrategyControlLoad.value);
        if (loadedColumn) {
            this.columns = JSON.parse(loadedColumn);
        }
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

    /*
    * Life Cycles
    */

    ngOnInit(): void {
        this.setDraggableData();

        this.mainUiListService
            .getStockListData(this.defaultValuesToBe)
            .subscribe(val => {
                this.stockList = val;
            });

        this.mainUiListService
            .getIssuerListData(this.defaultValuesToBe)
            .subscribe(val => {
                this.issuerList = val;
            });
    }
}
