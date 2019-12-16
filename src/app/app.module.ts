import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LottieModule } from '@ng-cari/lottie';
import { ThemeModule } from '@ng-cari/theme';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { ShowChartsComponent } from './home/show-charts/show-charts.component';
import { FirmwareManagerComponent } from './home/firmware-manager/firmware-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShowChartsComponent,
    FirmwareManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    LottieModule,
    ThemeModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    NgxEchartsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
