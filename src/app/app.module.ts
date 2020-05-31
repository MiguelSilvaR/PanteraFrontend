import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './Shared/Navbar/navbar.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApartadoComponent } from './apartado/apartado.component';
import { ApartarNuevoComponent } from './apartar-nuevo/apartar-nuevo.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { LoginComponent } from './login/login.component';
import { GraphqlModule } from './graphql/graphql.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarComponent } from './Shared/calendar/calendar.component';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-MX';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    ApartadoComponent,
    ApartarNuevoComponent,
    LoginComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    GraphqlModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
