// Angular
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
// 3rd party

@Injectable({ providedIn: 'root' })
export class LoginService {

    // private variables
    private BASE_URL = 'http://211.24.62.27:222/';

    modalIsOpen$: BehaviorSubject<string> = new BehaviorSubject('false');

    constructor(
        private httpClient: HttpClient,
    ) { }

    performLogin(body: object): Observable<any> {
        return this.httpClient.post(`${this.BASE_URL}Users/authenticate`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    getStatus(): Observable<any> {
        return this.httpClient.post(`${this.BASE_URL}v_main_ui_list/adv?limit=20&offset=1`, {})
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
        return of(error);
    }


}
