// tslint:disable: deprecation
import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MainUiListService } from '../../services/main-ui-list.service';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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

interface StringValueDescriptionInterface {
    value: string;
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
    CallPrice: string;
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
        'CallPrice',
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

    typesOfFilteringBackup: StringValueDescriptionInterface[] = [
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
        p_from: new FormControl(),
        p_to: new FormControl(),
        l_from: new FormControl(),
        l_to: new FormControl(),
        n_from: new FormControl(),
        n_to: new FormControl(),
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
        call: new FormControl(),
        put: new FormControl(),
        bull: new FormControl(),
        bear: new FormControl(),
        other: new FormControl(),
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
        if (this.strategyList().length > 0) {
            this.filterFormGroup.get('saveStrategyControl')?.setValue(this.strategyList()[0]);
            this.filterFormGroup.get('saveStrategyControlLoad')?.setValue(this.strategyList()[0]);
            setTimeout(() => {
                this.loadStrategy();
            }, 0);
        }
    }

    allSelectedFn(): void {
        const issuerValue = this.filterFormGroup.get('issuer')?.value;
        setTimeout(() => {
            if (issuerValue.find((issVal: string) => issVal === 'ALL')) {
                this.filterFormGroup.get('issuer')?.patchValue(this.issuerList);
            } else {
                this.filterFormGroup.get('issuer')?.patchValue([]);
            }
        }, 500);
    }

    setDraggableData(): void {
        this.columns = [
            { field: 'Add', header: 'Add', type: '' },
            { field: 'ASK', header: 'ASK', type: 'ask' },
            { field: 'BID', header: 'BID', type: 'bid' },
            { field: 'CHG', header: 'CHG', type: 'change' },
            { field: 'CODE', header: 'CODE', type: 'symbol' },
            { field: 'CP', header: 'CP', type: 'call_Price' },
            { field: 'CallPrice', header: 'Call Price', type: 'CallPrice' },
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
            { field: 'P', header: 'P', type: 'profit' },
            { field: 'PREM', header: 'PREM', type: 'premium' },
            { field: 'SEN', header: 'SEN', type: 'sensitivity' },
            { field: 'Spread', header: 'Spread', type: 'Spread' },
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

    updateChkbxArray(): void {
        this.typesOfFilteringBackup.forEach(obj => {
            if (this.filterFormGroup.get(obj.value)?.value) {
                if (!this.filterFormGroup.get('type')?.value.includes(obj.description)) {
                    this.filterFormGroup.get('type')?.value?.push(obj.description);
                }
            } else {
                if (this.filterFormGroup.get('type')?.value.includes(obj.description)) {
                    // tslint:disable-next-line: max-line-length
                    this.filterFormGroup.get('type')?.patchValue(this.filterFormGroup.get('type')?.value.filter((item: string) => item !== obj.description));
                }
            }
        });
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
                CP: ele.change_Percentage,
                CallPrice: ele.call_Price,
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
                Spread: ele.spread,
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
                    ${ele.quantity}
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
        return options.filter(option => option !== 'ALL') || [];
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
        // tslint:disable: max-line-length
        window.localStorage.setItem(this.filterFormGroup.value.saveStrategyControl, JSON.stringify(this.columns));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_issuer`, JSON.stringify(this.filterFormGroup.value.issuer));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_expiry_date`, JSON.stringify(this.filterFormGroup.value.expiry_date));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_listing_date`, JSON.stringify(this.filterFormGroup.value.listing_date));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_status`, JSON.stringify(this.filterFormGroup.value.status));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_conversion_ratio_from`, JSON.stringify(this.filterFormGroup.value.conversion_ratio_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_conversion_ration_to`, JSON.stringify(this.filterFormGroup.value.conversion_ration_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_delta_from`, JSON.stringify(this.filterFormGroup.value.delta_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_delta_to`, JSON.stringify(this.filterFormGroup.value.delta_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_filter_stock`, JSON.stringify(this.filterFormGroup.value.filter_stock));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_iV_from`, JSON.stringify(this.filterFormGroup.value.iV_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_iV_to`, JSON.stringify(this.filterFormGroup.value.iV_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_last_price_from`, JSON.stringify(this.filterFormGroup.value.last_price_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_last_price_to`, JSON.stringify(this.filterFormGroup.value.last_price_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_order_in`, JSON.stringify(this.filterFormGroup.value.order_in));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_outstanding_from`, JSON.stringify(this.filterFormGroup.value.outstanding_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_outstanding_to`, JSON.stringify(this.filterFormGroup.value.outstanding_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_premium_from`, JSON.stringify(this.filterFormGroup.value.premium_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_premium_to`, JSON.stringify(this.filterFormGroup.value.premium_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_p_from`, JSON.stringify(this.filterFormGroup.value.p_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_p_to`, JSON.stringify(this.filterFormGroup.value.p_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_l_from`, JSON.stringify(this.filterFormGroup.value.l_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_l_to`, JSON.stringify(this.filterFormGroup.value.l_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_sensitivity_from`, JSON.stringify(this.filterFormGroup.value.sensitivity_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_sensitivity_to`, JSON.stringify(this.filterFormGroup.value.sensitivity_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_sorted_by`, JSON.stringify(this.filterFormGroup.value.sorted_by));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_spread_from`, JSON.stringify(this.filterFormGroup.value.spread_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_spread_to`, JSON.stringify(this.filterFormGroup.value.spread_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_square_multiple_from`, JSON.stringify(this.filterFormGroup.value.square_multiple_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_square_multiple_to`, JSON.stringify(this.filterFormGroup.value.square_multiple_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_stockIssuerControl`, JSON.stringify(this.filterFormGroup.value.stockIssuerControl));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_symbol`, JSON.stringify(this.filterFormGroup.value.symbol));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_to_call_price_from`, JSON.stringify(this.filterFormGroup.value.to_call_price_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_to_call_price_to`, JSON.stringify(this.filterFormGroup.value.to_call_price_to));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_type`, JSON.stringify(this.filterFormGroup.value.type));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_volume_from`, JSON.stringify(this.filterFormGroup.value.volume_from));
        window.localStorage.setItem(`${this.filterFormGroup.value.saveStrategyControl}_volume_to`, JSON.stringify(this.filterFormGroup.value.volume_to));
    }

    loadStrategy(): void {
        const loadedColumn = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad);
        if (loadedColumn) {
            this.columns = JSON.parse(loadedColumn);
        }
        const loadedIssuer = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_issuer');
        if (loadedIssuer) {
            this.filterFormGroup.controls.issuer.setValue(JSON.parse(loadedIssuer));
        }
        const loadedExpiryDate = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_expiry_date');
        if (loadedExpiryDate) {
            this.filterFormGroup.controls.expiry_date.setValue(JSON.parse(loadedExpiryDate));
        }
        const loadedListingDate = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_listing_date');
        if (loadedListingDate) {
            this.filterFormGroup.controls.listing_date.setValue(JSON.parse(loadedListingDate));
        }
        const loadedStatus = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_status');
        if (loadedStatus) {
            this.filterFormGroup.controls.status.patchValue(JSON.parse(loadedStatus));
        }

        // tslint:disable: variable-name

        const loadedconversion_ratio_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_conversion_ratio_from');
        if (loadedconversion_ratio_from) {
            this.filterFormGroup.controls.conversion_ratio_from.patchValue(JSON.parse(loadedconversion_ratio_from));
        }

        const loadedconversion_ration_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_conversion_ration_to');
        if (loadedconversion_ration_to) {
            this.filterFormGroup.controls.conversion_ration_to.patchValue(JSON.parse(loadedconversion_ration_to));
        }

        const loadeddelta_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_delta_from');
        if (loadeddelta_from) {
            this.filterFormGroup.controls.delta_from.patchValue(JSON.parse(loadeddelta_from));
        }

        const loadeddelta_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_delta_to');
        if (loadeddelta_to) {
            this.filterFormGroup.controls.delta_to.patchValue(JSON.parse(loadeddelta_to));
        }

        const loadedfilter_stock = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_filter_stock');
        if (loadedfilter_stock) {
            this.filterFormGroup.controls.filter_stock.patchValue(JSON.parse(loadedfilter_stock));
        }

        const loadediV_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_iV_from');
        if (loadediV_from) {
            this.filterFormGroup.controls.iV_from.patchValue(JSON.parse(loadediV_from));
        }

        const loadediV_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_iV_to');
        if (loadediV_to) {
            this.filterFormGroup.controls.iV_to.patchValue(JSON.parse(loadediV_to));
        }

        const loadedlast_price_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_last_price_from');
        if (loadedlast_price_from) {
            this.filterFormGroup.controls.last_price_from.patchValue(JSON.parse(loadedlast_price_from));
        }

        const loadedlast_price_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_last_price_to');
        if (loadedlast_price_to) {
            this.filterFormGroup.controls.last_price_to.patchValue(JSON.parse(loadedlast_price_to));
        }

        const loadedorder_in = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_order_in');
        if (loadedorder_in) {
            this.filterFormGroup.controls.order_in.patchValue(JSON.parse(loadedorder_in));
        }

        const loadedoutstanding_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_outstanding_from');
        if (loadedoutstanding_from) {
            this.filterFormGroup.controls.outstanding_from.patchValue(JSON.parse(loadedoutstanding_from));
        }

        const loadedoutstanding_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_outstanding_to');
        if (loadedoutstanding_to) {
            this.filterFormGroup.controls.outstanding_to.patchValue(JSON.parse(loadedoutstanding_to));
        }

        const loadedpremium_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_premium_from');
        if (loadedpremium_from) {
            this.filterFormGroup.controls.premium_from.patchValue(JSON.parse(loadedpremium_from));
        }

        const loadedpremium_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_premium_to');
        if (loadedpremium_to) {
            this.filterFormGroup.controls.premium_to.patchValue(JSON.parse(loadedpremium_to));
        }

        const loadedp_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_p_from');
        if (loadedp_from) {
            this.filterFormGroup.controls.p_from.patchValue(JSON.parse(loadedp_from));
        }

        const loadedp_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_p_to');
        if (loadedp_to) {
            this.filterFormGroup.controls.p_to.patchValue(JSON.parse(loadedp_to));
        }

        const loadedl_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_l_from');
        if (loadedl_from) {
            this.filterFormGroup.controls.l_from.patchValue(JSON.parse(loadedl_from));
        }

        const loadedl_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_l_to');
        if (loadedl_to) {
            this.filterFormGroup.controls.l_to.patchValue(JSON.parse(loadedl_to));
        }

        const loadedsensitivity_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_sensitivity_from');
        if (loadedsensitivity_from) {
            this.filterFormGroup.controls.sensitivity_from.patchValue(JSON.parse(loadedsensitivity_from));
        }

        const loadedsensitivity_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_sensitivity_to');
        if (loadedsensitivity_to) {
            this.filterFormGroup.controls.sensitivity_to.patchValue(JSON.parse(loadedsensitivity_to));
        }

        const loadedsorted_by = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_sorted_by');
        if (loadedsorted_by) {
            this.filterFormGroup.controls.sorted_by.patchValue(JSON.parse(loadedsorted_by));
        }

        const loadedspread_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_spread_from');
        if (loadedspread_from) {
            this.filterFormGroup.controls.spread_from.patchValue(JSON.parse(loadedspread_from));
        }

        const loadedspread_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_spread_to');
        if (loadedspread_to) {
            this.filterFormGroup.controls.spread_to.patchValue(JSON.parse(loadedspread_to));
        }

        const loadedsquare_multiple_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_square_multiple_from');
        if (loadedsquare_multiple_from) {
            this.filterFormGroup.controls.square_multiple_from.patchValue(JSON.parse(loadedsquare_multiple_from));
        }

        const loadedsquare_multiple_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_square_multiple_to');
        if (loadedsquare_multiple_to) {
            this.filterFormGroup.controls.square_multiple_to.patchValue(JSON.parse(loadedsquare_multiple_to));
        }

        const loadedstockIssuerControl = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_stockIssuerControl');
        if (loadedstockIssuerControl) {
            this.filterFormGroup.controls.stockIssuerControl.patchValue(JSON.parse(loadedstockIssuerControl));
        }

        const loadedsymbol = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_symbol');
        if (loadedsymbol) {
            this.filterFormGroup.controls.symbol.patchValue(JSON.parse(loadedsymbol));
        }

        const loadedto_call_price_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_to_call_price_from');
        if (loadedto_call_price_from) {
            this.filterFormGroup.controls.to_call_price_from.patchValue(JSON.parse(loadedto_call_price_from));
        }

        const loadedto_call_price_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_to_call_price_to');
        if (loadedto_call_price_to) {
            this.filterFormGroup.controls.to_call_price_to.patchValue(JSON.parse(loadedto_call_price_to));
        }

        const loadedtype = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_type');
        if (loadedtype) {
            // this.filterFormGroup.controls.type.patchValue(JSON.parse(loadedtype));
        }

        const loadedvolume_from = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_volume_from');
        if (loadedvolume_from) {
            this.filterFormGroup.controls.volume_from.patchValue(JSON.parse(loadedvolume_from));
        }

        const loadedvolume_to = this.getLocalStorage(this.filterFormGroup.value.saveStrategyControlLoad + '_volume_to');
        if (loadedvolume_to) {
            this.filterFormGroup.controls.volume_to.patchValue(JSON.parse(loadedvolume_to));
        }
    }

    strategyList(): string[] {
        const allLocalStorage = this.getAllStrategies();
        return allLocalStorage
            .filter(ele => {
                return !ele.includes('_issuer')
                    && !ele.includes('_expiry_date')
                    && !ele.includes('_listing_date')
                    && !ele.includes('_status')
                    && !ele.includes('_conversion_ratio_from')
                    && !ele.includes('_conversion_ration_to')
                    && !ele.includes('_delta_from')
                    && !ele.includes('_delta_to')
                    && !ele.includes('_filter_stock')
                    && !ele.includes('_iV_from')
                    && !ele.includes('_iV_to')
                    && !ele.includes('_last_price_from')
                    && !ele.includes('_last_price_to')
                    && !ele.includes('_order_in')
                    && !ele.includes('_outstanding_from')
                    && !ele.includes('_outstanding_to')
                    && !ele.includes('_premium_from')
                    && !ele.includes('_premium_to')
                    && !ele.includes('_p_from')
                    && !ele.includes('_p_to')
                    && !ele.includes('_l_from')
                    && !ele.includes('_l_to')
                    && !ele.includes('_sensitivity_from')
                    && !ele.includes('_sensitivity_to')
                    && !ele.includes('_sorted_by')
                    && !ele.includes('_spread_from')
                    && !ele.includes('_spread_to')
                    && !ele.includes('_square_multiple_from')
                    && !ele.includes('_square_multiple_to')
                    && !ele.includes('_stockIssuerControl')
                    && !ele.includes('_to_call_price_from')
                    && !ele.includes('_to_call_price_to')
                    && !ele.includes('_type')
                    && !ele.includes('_volume_from')
                    && !ele.includes('_volume_to')
                    && !ele.includes('_symbol')
                    && !ele.includes('randid');
            });
    }

    listCookies(): object {
        return document.cookie.split(';').reduce((cookies, cookie) => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            return { ...cookies, [name]: value };
        }, {});
    }

    getLocalStorage(localstorageTarget: string): string | null {
        return localStorage.getItem(localstorageTarget);
    }

    getAllStrategies(): string[] {
        return this.allStorage();
    }

    allStorage(): string[] {
        const values = [];
        const keys = Object.keys(localStorage);
        let i = keys.length;
        while (i--) {
            values.push(keys[i]);
        }
        return values;
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
