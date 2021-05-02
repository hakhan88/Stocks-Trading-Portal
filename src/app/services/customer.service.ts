// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 3rd party

@Injectable({ providedIn: 'root' })
export class CustomerListService {

    // private variables
    private BASE_URL = 'http://18.162.51.206:222/';

    constructor(
        private httpClient: HttpClient,
    ) { }


    getUsersListData(): Observable<any> {
        return this.httpClient.get(`${this.BASE_URL}Users`, {})
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
