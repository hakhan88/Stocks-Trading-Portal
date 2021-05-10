// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 3rd party

@Injectable({ providedIn: 'root' })
export class MainUiListService {

    // private variables
    private BASE_URL = 'http://211.24.62.27:222/';

    constructor(
        private httpClient: HttpClient,
    ) { }


    getMainUiListData(body: any, offset = 0, limit = 20): Observable<any> {
        return this.httpClient.post(`${this.BASE_URL}v_main_ui_list/adv?limit=${limit}&offset=${offset}`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getStockListData(body: any): Observable<any> {
        return this.httpClient.post(`${this.BASE_URL}v_main_ui_list/symbolName`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getIssuerListData(body: any): Observable<any> {
        return this.httpClient.post(`${this.BASE_URL}v_main_ui_list/issuer`, body)
            .pipe(
                catchError(this.handleError)
            );
    }


    getAskBidListData(symbol: string): Observable<any> {
        return this.httpClient.post(`${this.BASE_URL}v_ask_bid_list?Symbol=` + symbol, {})
            .pipe(
                catchError(this.handleError)
            );
    }


    getTransactionLogListData(symbol: string): Observable<any> {
        return this.httpClient.post(`${this.BASE_URL}v_transaction_log/buy?Symbol=` + symbol, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError(
            'Something bad happened; please try again later.');
    }

}
