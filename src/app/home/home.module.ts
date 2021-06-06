import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module'; 
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../navbar/navbar.component'
import { AngularSplitModule } from 'angular-split';
import { RightpaneComponent } from './rightpane/rightpane.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [HomeComponent, NavbarComponent, RightpaneComponent ],
  imports: [CommonModule, SharedModule, HomeRoutingModule, BrowserModule,
    AngularSplitModule,
    NgbModule]
})
export class HomeModule {}
