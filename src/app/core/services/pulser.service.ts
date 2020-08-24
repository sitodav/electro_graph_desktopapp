
import { Injectable } from '@angular/core';
import { UrlModel } from '../models/url.model';
import { Subject } from 'rxjs';
import { randomBytes } from 'crypto'; 

@Injectable({providedIn : 'root'})
export class PulserService
{
    public urlElements : Map<String,UrlModel> = 
        new Map<String, UrlModel>();

    public  _events : Subject<any>[] = [];
    public  _timers : number[] = [];
     
    public startCheckingUrl(url : String )
    {
        let newSubject = new Subject<any>();
        
        let timer = window.setInterval(() => {
            /*TODO call the url */
            console.log("query for "+url);
            if(Math.random() > 0.5)
            {
                newSubject.next("OK");
            }
            else newSubject.next("KO");
        },2000);
        
        this._timers.push(timer);
        this._events.push(newSubject);
        return newSubject;
    }

    public stopCheckingUrl(idx : number)
    {
        window.clearInterval(this._timers[idx]);

    }
    

     
}