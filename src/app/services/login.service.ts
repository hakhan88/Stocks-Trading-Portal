// Angular
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// 3rd party

@Injectable({ providedIn: 'root' })
export class LoginService {

    modalIsOpen$: BehaviorSubject<string> = new BehaviorSubject('false');

}
