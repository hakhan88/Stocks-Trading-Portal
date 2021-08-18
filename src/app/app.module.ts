import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { SigninComponent } from './components/signin/signin.component';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserComponent } from './components/editUser/editUser.component';
import { UserListComponent } from './components/userList/userList.component';
import { SanitizeHtmlPipe } from './pipes/sanitinse.pipe';
import { StockDetailsComponent } from './components/stockDetails/stockDetails.component';
import { LoginService } from './services/login.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MainUiListService } from './services/main-ui-list.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './services/loadingInterceptor.service';
import { LoadingService } from './services/loading.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomerListService } from './services/customer.service';
import { AuthService } from './services/Auth.service';
import { AuthInterceptor } from './services/auth-Interceptor.service';

@NgModule({
    declarations: [
        AppComponent,
        SigninComponent,
        EditUserComponent,
        UserListComponent,
        SanitizeHtmlPipe,
        StockDetailsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSliderModule,
        AngularMaterialModule,
        FlexLayoutModule,
        FlexModule,
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        HttpClientModule,
        FontAwesomeModule,
    ],
    providers: [
        LoginService,
        MainUiListService,
        LoadingService,
        CustomerListService,
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
