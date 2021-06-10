import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Elementt } from '../elementt.class';

@Injectable({
  providedIn: 'root'
})
export class ElementiService {

  public subjUpdateElementi : Subject<Elementt[]> = new Subject<Elementt[]>(); 
  constructor() { }

  public aggiornaElementi(elements : Elementt[])
  {
    this.subjUpdateElementi.next(elements);
  }

  public aggiornatiElementi() : Observable<Elementt[]>
  {
    return this.subjUpdateElementi.asObservable();
  }


}
