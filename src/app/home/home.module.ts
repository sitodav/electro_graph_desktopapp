import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module'; 
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../navbar/navbar.component'
import { AngularSplitModule } from 'angular-split';
import { DownpaneComponent } from './downpane/downpane.component';
import { BrowserModule } from '@angular/platform-browser';
import { RightpaneComponent } from './rightpane/rightpane.component';

@NgModule({
  declarations: [HomeComponent, NavbarComponent, DownpaneComponent, RightpaneComponent ],
  imports: [CommonModule, SharedModule, HomeRoutingModule, BrowserModule,
    AngularSplitModule,
    NgbModule]
})
export class HomeModule {}
