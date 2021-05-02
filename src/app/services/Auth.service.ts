import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {

    getToken(): string {
        return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJyb2xlIjoiQWRtaW4iLCJuYmYiOjE2MTk4OTI2MTQsImV4cCI6MTYxOTk3OTAxNCwiaWF0IjoxNjE5ODkyNjE0fQ.IfwylMhxCw1gPBlnPHi3vFFvB1J74rfJxLF_0yajgxE';
    }

}
