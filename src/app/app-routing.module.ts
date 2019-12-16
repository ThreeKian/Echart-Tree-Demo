import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import { ShowChartsComponent } from './home/show-charts/show-charts.component';
import { FirmwareManagerComponent } from './home/firmware-manager/firmware-manager.component';


const routes: Routes = [
  {
    path: '', redirectTo: 'home/charts', pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [{
      path: 'charts', component: ShowChartsComponent
    }, {
      path: 'manager', component: FirmwareManagerComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
