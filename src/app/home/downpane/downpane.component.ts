import { HomeComponent } from './../home.component';
import { ElementiService } from '../elementiservice/elementi.service';
import { Component, Host, OnInit, ViewChild } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Elementt } from '../elementt.class';

@Component({
  selector: 'app-downpane',
  templateUrl: './downpane.component.html',
  styleUrls: ['./downpane.component.scss']
})
export class DownpaneComponent implements OnInit {
  public isCollapsed = false;

  @ViewChild(NgbAccordion)
  accordion : NgbAccordion;

  elementi:Elementt[] = [];
  constructor(@Host() private parent: HomeComponent,public elementiService : ElementiService) { }

  ngOnInit(): void {
    this.elementiService.aggiornatiElementi().subscribe(els => {
      this.elementi = els;
    })
  }

  public identificaElementoSuDownpane(idAcc : string)
  {
    console.log("espando "+idAcc);
    // this.elementi.forEach(elm => {console.log(elm.id)});
    //this.accordion.toggle(idAcc);
  }

  public clickSuElemento(elm : Elementt,evt)
  {
    this.parent.simulateCustomDoubleClick(elm.label);
    evt.stopPropagation();
  }

}
