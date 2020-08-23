import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public electroService : ElectronService) { }

  ngOnInit(): void {
  }

  public minimizeWindow = () => {
    this.electroService.window.minimize();
  }

  public closeWindow = () => {
    this.electroService.window.close();
  }
}
