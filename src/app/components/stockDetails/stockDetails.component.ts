// tslint:disable: deprecation
import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MainUiListService } from '../../services/main-ui-list.service';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatOption } from '@angular/material/core';

interface StockIssuerListInterface {
    symbol: number;
    name: string;
    symbolName: string;
}

interface ValueDescriptionInterface {
    value: number | string;
    description: string;
}

interface FieldHeaderInterface {
    field: string;
    header: string;
    type?: string;
}

export interface PeriodicElement {
    Add?: string;
    ASK: string;
    BID: string;
    CHG: string;
    CODE: string;
    CP: string;
    CR: string;
    D: string;
    EXP: string;
    ISR: string;
    IV: string;
    K: string;
    L: string;
    LAST: string;
    Name: string;
    NET: string;
    OUT: string;
    OUTS: string;
    P: string;
    PREM: string;
    SEN: string;
    SPRD: string;
    SQX: string;
    STK: string;
    stock?: string;
    TO: string;
    TY: string;
    VOL: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
interface BidAskInterface {
    Ask: string;
    Bid: string;
}

const BIDDING_ELEMENT_DATA: BidAskInterface[] = [];
const TRANSACTION_LOG_DATA: BidAskInterface[] = [];

@Component({
    selector: 'app-stock-details',
    templateUrl: './stockDetails.component.html',
    styleUrls: ['./stockDetails.component.scss']
})
export class StockDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

    /*
     * Private Variables
    */

    private filterInterval: any;
    private rowClickedInterval: any;
    private elementClicked: PeriodicElement | undefined;
    private unsubscribe$: Subject<any> = new Subject();
    private defaultValuesToBe = {
        conversion_ratio_from: 0,
        conversion_ration_to: 0,
        iV_from: 0,
        iV_to: 0,
        last_price_from: 0,
        last_price_to: 0,
        outstanding_from: 0,
        outstanding_to: 0,
        premium_from: 0,
        premium_to: 0,
        sensitivity_from: 0,
        sensitivity_to: 0,
        spread_from: 0,
        spread_to: 0,
        square_multiple_from: 0,
        square_multiple_to: 0,
        to_call_price_from: 0,
        to_call_price_to: 0,
        volume_from: 0,
        volume_to: 0,
    };

    /*
     * View Child
    */

    @ViewChild('allSelected') private allSelected: MatOption | undefined;

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
    headerSelected: FieldHeaderInterface | undefined;
    headerSelectedDirection: string | undefined;

    sortedByList: string[] = [];
    displayedColumns: string[] = [
        'Add',
        'ASK',
        'BID',
        'CHG',
        'CODE',
        'CP',
        'CR',
        'D',
        'EXP',
        'ISR',
        'IV',
        'K',
        'L',
        'LAST',
        'Name',
        'NET',
        'OUT',
        'OUTS',
        'P',
        'PREM',
        'SEN',
        'SQX',
        'Stock',
        'TO',
        'TY',
        'VOL',
    ];
    columnsToDisplay: string[] = this.displayedColumns.slice();
    data: PeriodicElement[] = ELEMENT_DATA;

    availableContactStatuses = [ // TODO get values from cham on this
        {
            value: 2,
            display: 'Normal'
        },
        {
            value: 3,
            display: 'Stopped Trading'
        },
        {
            value: 4,
            display: 'Waiting Listing'
        },
    ];

    typesOfFiltering: ValueDescriptionInterface[] = [
        { value: 'call', description: 'Call' },
        { value: 'put', description: 'Put' },
        { value: 'bull', description: 'Bull' },
        { value: 'bear', description: 'Bear' },
        { value: 'other', description: 'Other' },
    ];

    // All Form controls
    // tslint:disable: member-ordering
    filterFormGroup = new FormGroup({
        conversion_ratio_from: new FormControl(),
        conversion_ration_to: new FormControl(),
        delta_from: new FormControl(),
        delta_to: new FormControl(),
        expiry_date: new FormControl(),
        filter_stock: new FormControl(),
        issuer: new FormControl([]),
        iV_from: new FormControl(),
        iV_to: new FormControl(),
        last_price_from: new FormControl(),
        last_price_to: new FormControl(),
        listing_date: new FormControl(),
        order_in: new FormControl(),
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
        stockIssuerControl: new FormControl(),
        symbol: new FormControl([]),
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
    ) { }

    setDraggableData(): void {
        this.columns = [
            { field: 'Add', header: 'Add', type: '' },
            { field: 'ASK', header: 'ASK', type: 'ask' },
            { field: 'BID', header: 'BID', type: 'bid' },
            { field: 'CHG', header: 'CHG', type: 'change' },
            { field: 'CODE', header: 'CODE', type: 'symbol' },
            { field: 'CP', header: 'CP', type: 'call_Price' },
            { field: 'CR', header: 'CR', type: 'conversion_Ratio' },
            { field: 'D', header: 'D', type: 'delta' },
            { field: 'EXP', header: 'EXP', type: 'expiry_Date' },
            { field: 'ISR', header: 'ISR', type: 'issuer' },
            { field: 'IV', header: 'IV', type: 'iv' },
            { field: 'K', header: 'K', type: 'exercise_Price' },
            { field: 'L', header: 'L', type: 'loss' },
            { field: 'LAST', header: 'LAST', type: 'last' },
            { field: 'Name', header: 'Name', type: 'name' },
            { field: 'NET', header: 'NET', type: 'net' },
            { field: 'OUT', header: 'OUT', type: 'outstanding_Qty' },
            { field: 'OUTS', header: 'OUTS', type: 'OUTS' },
            { field: 'P', header: 'P', type: 'profit' },
            { field: 'PREM', header: 'PREM', type: 'premium' },
            { field: 'SEN', header: 'SEN', type: 'sensitivity' },
            { field: 'SQX', header: 'SQX', type: 'square_Multiple' },
            { field: 'stock', header: 'Stock', type: 'stock' },
            { field: 'TO', header: 'TO', type: 'turnover' },
            { field: 'TY', header: 'TY', type: 'type' },
            { field: 'VOL', header: 'VOL', type: 'volume' },
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
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(val => {
                this.data = this.concertBe2FE(val.data);
                this.paginateData = this.concertBe2FE(val.data);
                this.pageLength = val.totalCount;
            });
    }

    updateChkbxArray(chk: { value: string | number; description: string; }, isChecked: any, key: any): void {
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

    headerFilter(column: FieldHeaderInterface): void {
        this.headerSelected = column;
        const nextFilteringState = this.filterFormGroup.value.order_in === 'ASC' ? 'DESC' : 'ASC';
        this.filterFormGroup.controls.order_in.setValue(nextFilteringState);

        if (this.formSubmitted) {
            this.filterFormGroup.controls.sorted_by
                .patchValue(column.type);
            this.filter();
        }
    }

    headerSelectedDirectionValue(): boolean {
        return this.filterFormGroup.value.order_in === 'ASC';
    }

    isHeaderSelected(column: FieldHeaderInterface): boolean {
        return this.headerSelected?.header === column.header;
    }

    toggleAllSelection(): void {
        if (this.allSelected?.selected) {
            const availableContactStatusesCopy = [...this.availableContactStatuses];
            availableContactStatusesCopy.push({ value: 1, display: '' });
            this.filterFormGroup.controls.status
                .patchValue(availableContactStatusesCopy.map(item => item.value));
        } else {
            this.filterFormGroup.controls.status.patchValue([]);
        }
    }

    concertBe2FE(array: any): any[] {
        const mappedToFe: any[] = [];
        array.forEach((ele: { [x: string]: any; }) => {
            const mapObject = {
                Add: `<a href="hkex://ec2-18-162-51-206.ap-east-1.compute.amazonaws.com/warren/stockDetails?triggeradd=${ele.symbol}">Add</a>`,
                ASK: ele.ask,
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
                Name: ele.name,
                NET: ele.net,
                OUT: ele.outstanding_Qty,
                OUTS: ele.OUTS,
                P: ele.profit,
                PREM: ele.premium,
                SEN: ele.sensitivity,
                SPRD: ele.spread,
                SQX: ele.square_Multiple,
                STK: ele.stock,
                stock: ele.stock,
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
                Ask: `${ele.ask_Price} ${ele.ask_Quantity}`,
                Bid: `${ele.bid_Price} ${ele.bid_Quantity}`,
            };
            mappedToFe.push(mapObject);
        });
        return mappedToFe;
    }

    rowClicked(element: PeriodicElement, body = {}): void {
        this.elementClicked = element;
        this.SymbolSelected = element.CODE;
        this.NameSelected = element.Name;
        this.mainUiListService
            .getAskBidListData(element.CODE, body)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(getAskBidListDataVal => {
                this.biddingListData = this.convertBidList2FE(getAskBidListDataVal);
            });
        this.mainUiListService
            .getTransactionLogListData(element.CODE, body)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(getTransactionLogListDataVal => {
                this.transactionLogs = this.convertTransaction2FE(getTransactionLogListDataVal);
            });
    }

    getStockListOptions(options: any[]): any[] {
        return options || [];
    }

    getIssuerListOptions(options: any[]): any[] {
        return options || [];
    }

    getServerData(event: any): void {
        this.mainUiListService
            .getMainUiListData(this.filterFormGroup.value, event.pageIndex * this.pageSize)
            .pipe(takeUntil(this.unsubscribe$))
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
        document.cookie = `${this.filterFormGroup.value.saveStrategyControl}=${JSON.stringify(this.columns)}`;
        document.cookie = `${this.filterFormGroup.value.saveStrategyControl}_issuer=${JSON.stringify(this.filterFormGroup.value.issuer)}`;
        document.cookie = `${this.filterFormGroup.value.saveStrategyControl}_expiry_date=${JSON.stringify(this.filterFormGroup.value.expiry_date)}`;
        document.cookie = `${this.filterFormGroup.value.saveStrategyControl}_listing_date=${JSON.stringify(this.filterFormGroup.value.listing_date)}`;
        document.cookie = `${this.filterFormGroup.value.saveStrategyControl}_status=${JSON.stringify(this.filterFormGroup.value.status)}`;
    }

    loadStrategy(): void {
        const loadedColumn = this.getCookie(this.filterFormGroup.value.saveStrategyControlLoad);
        if (loadedColumn) {
            this.columns = JSON.parse(loadedColumn);
        }
        const loadedIssuer = this.getCookie(this.filterFormGroup.value.saveStrategyControlLoad + '_issuer');
        if (loadedIssuer) {
            this.filterFormGroup.controls.issuer.setValue(JSON.parse(loadedIssuer));
        }
        const loadedExpiryDate = this.getCookie(this.filterFormGroup.value.saveStrategyControlLoad + '_expiry_date');
        if (loadedExpiryDate) {
            this.filterFormGroup.controls.expiry_date.setValue(JSON.parse(loadedExpiryDate));
        }
        const loadedListingDate = this.getCookie(this.filterFormGroup.value.saveStrategyControlLoad + '_listing_date');
        if (loadedListingDate) {
            this.filterFormGroup.controls.listing_date.setValue(JSON.parse(loadedListingDate));
        }
        const loadedStatus = this.getCookie(this.filterFormGroup.value.saveStrategyControlLoad + '_status');
        if (loadedStatus) {
            this.filterFormGroup.controls.status.patchValue(JSON.parse(loadedStatus));
        }
    }

    strategyList(): string[] {
        const allCookies = this.listCookies();
        return Object.keys(allCookies).filter(ele => !ele.includes('_issuer') && !ele.includes('_expiry_date') && !ele.includes('_listing_date') && !ele.includes('_status'));
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
        this.filterInterval = setInterval(() => {
            if (this.formSubmitted) {
                this.filter();
            }
        }, 50000);

        this.rowClickedInterval = setInterval(() => {
            if (this.formSubmitted && this.elementClicked) {
                this.rowClicked(this.elementClicked, { disableLoading: true });
            }
        }, 5000);
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.mainUiListService
                .getStockListData(this.defaultValuesToBe)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(val => {
                    this.stockList = val;
                });

            this.mainUiListService
                .getIssuerListData(this.defaultValuesToBe)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(val => {
                    this.issuerList = val;
                    this.filterFormGroup.controls.issuer.patchValue([this.issuerList[0]]);
                });

            this.mainUiListService
                .getStockCategoryListData()
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(val => {
                    this.sortedByList = val;
                });
        }, 0);
    }

    ngOnDestroy(): void {
        clearInterval(this.filterInterval);
        clearInterval(this.rowClickedInterval);
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
