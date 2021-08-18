// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App
import { SigninComponent } from './components/signin/signin.component';
import { EditUserComponent } from './components/editUser/editUser.component';
import { UserListComponent } from './components/userList/userList.component';
import { StockDetailsComponent } from './components/stockDetails/stockDetails.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'signin' },
    { path: 'signin', component: SigninComponent },
    { path: 'editUser', component: EditUserComponent },
    { path: 'userList', component: UserListComponent },
    { path: 'stockDetails', component: StockDetailsComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
