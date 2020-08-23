import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ElectronService } from 'app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public _showWelcomeMessage : boolean = true;
  public _dateModel: NgbDateStruct;
  public _opened : boolean = false;

  constructor(private router: Router,private modalService: NgbModal,
    public electronService : ElectronService) { }

  ngOnInit(): void { 


    var date = new Date();
    this._dateModel = 
    { day: date.getUTCDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear()};


      setTimeout(()=>{
        this._showWelcomeMessage = false;
      },10000)

  }

  openBackDropCustomClass(content) {
    this.modalService.open(content, 
      {
        backdrop : 'static',
        backdropClass: 'light-blue-backdrop'
    });
  }

  enlargeWindow()
  {
    this._opened = true;
    this.electronService.window.setSize(343,800);
  }

  shrinkWindow()
  {
    this._opened = false;
    this.electronService.window.setSize(343,115);

  }


  

}
