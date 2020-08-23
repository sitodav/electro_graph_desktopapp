import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module'; 
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../navbar/navbar.component'

@NgModule({
  declarations: [HomeComponent, NavbarComponent ],
  imports: [CommonModule, SharedModule, HomeRoutingModule,
  
    NgbModule]
})
export class HomeModule {}
