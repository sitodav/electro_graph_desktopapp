import { ElementiService } from './../elementiservice/elementi.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Elementt } from '../elementt.class';

@Component({
  selector: 'app-rightpane',
  templateUrl: './rightpane.component.html',
  styleUrls: ['./rightpane.component.scss']
})
export class RightpaneComponent implements OnInit {
  public isCollapsed = false;

  @ViewChild(NgbAccordion)
  accordion : NgbAccordion;

  elementi:Elementt[] = [];
  constructor(public elementiService : ElementiService) { }

  ngOnInit(): void {
    this.elementiService.aggiornatiElementi().subscribe(els => {
      this.elementi = els;
    })
  }

  public identificaElemento(idAcc : string)
  {
    console.log("espando "+idAcc);
    this.elementi.forEach(elm => {console.log(elm.id)});
    this.accordion.toggle(idAcc);
  }

}
