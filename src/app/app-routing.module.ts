// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// App
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { EditUserComponent } from './components/editUser/editUser.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'signin' },
    { path: 'signin', component: SigninComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'editUser', component: EditUserComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
