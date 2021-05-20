import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
    private isLoading$ = new BehaviorSubject<boolean>(false);
    isLoadingObservable$ = this.isLoading$.asObservable();

    setLoading(isLoading: boolean): void {
        this.isLoading$.next(isLoading);
    }
}
