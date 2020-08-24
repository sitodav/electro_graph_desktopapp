import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ElectronService } from 'app/core/services';
import { PulserService } from 'app/core/services/pulser.service';
import { UrlModel } from '../core/models/url.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public _showWelcomeMessage : boolean = true; 
  public _opened : boolean = false;
  public _newUrl : string;

  constructor(private router: Router,private modalService: NgbModal,
    public electronService : ElectronService,
    public pulserService : PulserService) { }
    public addedUrls :  UrlModel[] = [];
    public subscriptions : Subscription[] = [];

  ngOnInit(): void { 
 
      setTimeout(()=>{
        this._showWelcomeMessage = false;
      },10000);
 
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

  
  public addUrl()
  {
    let elem = {url : this._newUrl, available : false, lastAvailability : null};

    this.addedUrls.push(elem);
    this.subscriptions.push(this.pulserService.startCheckingUrl(this._newUrl).asObservable()
      .subscribe(evt => {
        if("OK" == evt)
        {
          elem.available = true;
          elem.lastAvailability = new Date();
        } 
        else{
          elem.available = false;
        }

      }));
  }

  public removeUrl(idx:number)
  {
    this.pulserService.stopCheckingUrl(idx);
    this.addedUrls.splice(idx,1);
    this.subscriptions[idx].unsubscribe();
  }




  

}
