import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as p5 from 'p5';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  canvas;
  constructor(private router: Router) { }

  ngOnInit(): void { 


    const sketch = s => {
      s.setup = () => {
        let canvas2 = s.createCanvas(s.windowWidth - 200, s.windowHeight - 200);
        // creating a reference to the div here positions it so you can put things above and below
        // where the sketch is displayed
        canvas2.parent('sketch-holder');
     
        s.background("#1A2933");
       
      
      };
     
      s.draw = () => {
       
        s.background("#1A2933");
        s.stroke(0,120);
        s.ellipse(s.mouseX,s.mouseY,30,30);
      };
     
      s.mouseReleased = () => {
        console.log("hello");
      };
     
      s.keyPressed = () => {
         console.log("hello");
      };
    };
     
    this.canvas = new p5(sketch);




  }

}
