import { DownpaneComponent } from './downpane/downpane.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'app/core/services';
import { BrowserWindow } from 'electron';
import * as p5 from 'p5';
import rough from 'roughjs/bundled/rough.cjs';
import { Elementt } from "./elementt.class";
import { ElementiService } from './elementiservice/elementi.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  p5wrapper;
  electronWindow: BrowserWindow;

  @ViewChild(DownpaneComponent)
  downpaneComponent: DownpaneComponent;

  constructor(private router: Router, public electroService: ElectronService,
    public elementiService: ElementiService) { }

  ngOnInit(): void {
    /*
      lo sketch viene definito come funzione richiamata nell'init passandola
      al costruttore di p5()
      Tutte le funzioni classiche di p5js devono essere chiamate sulla variabile
      che mantiene lo sketch
    */
    this.p5wrapper = new p5(this._thisissketch);
    this.initVariabiliGlobaliP5();

    // /*visto che nello sketch, per collegare resize electron window ale resize dello sketch p5js
    // devo avere puntamento alla window,
    // l'electron service non e' immediato, quindi l'inizializzazione di p5js deve essere successiva
    // alla risoluzione dell'electron service*/
    // new Promise(() => {
    //   setTimeout(() => {
    //     console.log("INIZIALIZZO SKETCH P5JS E VARIABILI GLOBALI")
    //     this.electronWindow = this.electroService.window;


    //   }, 2000);
    // }).then(() => {

    //   this.p5wrapper = new p5(this._thisissketch);
    //   this.initVariabiliGlobaliP5();

    // })



  }


  public _thisissketch = (s) => {
    //p5js setup function
    s.setup = () => {
      let canvas2 = s.createCanvas(s.windowWidth - 180, s.windowHeight - 200);
      canvas2.parent('sketch-holder'); //questo lo aggancia al template angular 
      s.background("#ffffff"); //background come quello del container electron


      this.lastClick = s.millis();//Math.floor(Date.now() / 1000);
      //inizializzo roughjs installato come dipendenza

      this.rc = rough.canvas(document.getElementById('defaultCanvas0') as HTMLCanvasElement);

      s.textSize(10);
      s.textAlign(s.CENTER, s.CENTER);
      this.sketchRef = s;
    };



    //p5js draw function
    s.draw = () => {

      this.hideAllInputs();
      if (this.DOUBLE_CLICKED) {
        this.customDoubleClick();
        this.DOUBLE_CLICKED = false;
      }
      s.background("#ffffff");
      for (let i in this.roots) {
        this.roots[i]._draw();
      }

    };


    s.mouseMoved = () => {
      s.loop();
    }


    s.mouseStopped = () => {
      s.noLoop();
    }


    s.keyPressed = () => {
      if (s.keyCode == s.SHIFT) {
        this.ISSHIFT_DOWN = true;
      }
    }


    s.keyReleased = () => {
      this.ISSHIFT_DOWN = false;
    }

   

    s.mouseClicked = () => {
      if(!this.inSketch(s.mouseX,s.mouseY,this.sketchRef))
      {
        return ;
      }
      if (this.DOUBLE_CLICKED || this.ININPUT)
        return;

      //console.log("CLICKED");
      let amInExisting = false;
      for (let i in this.roots) {
        let found = this.roots[i]._checkMouseIn(s.mouseX, s.mouseY);
        amInExisting = found;
        if (found)
          break;
      }

      if (amInExisting)
        return;

      let newRoot = Elementt._builder(s.createVector(s.mouseX, s.mouseY), 50, "contenuto " + (s.frameCount % 1000),
        "singolo " + (s.frameCount % 1000), this.sketchRef, this.rc, this.palettes, this);
      //this.createElementt(s.createVector(s.mouseX, s.mouseY), 35, "", "");
      newRoot.isRoot = true;

      this.roots.push(newRoot);


      if (null != this.dragged) {
        this.dragged.isDragged = false;
        this.dragged = null;
      }
      this.restoreRoots();
      s.loop(1);
    }

    s.mouseDragged = () => {
      if (this.DOUBLE_CLICKED || this.ININPUT)
        return;

      if (null != this.dragged) {
        this.dragged.center = s.createVector(s.mouseX, s.mouseY);
        this.dragged.goToCenter = this.dragged.center.copy();
      }
      s.loop(1);
    }


    s.mousePressed = () => {

      let millisT = s.millis(); //Math.floor(Date.now() / 1000);
      if (millisT - this.lastClick < 200)
        this.DOUBLE_CLICKED = true;
      else this.DOUBLE_CLICKED = false;

      this.lastClick = s.millis();//Math.floor(Date.now() / 1000);

      if (this.DOUBLE_CLICKED || this.ININPUT)
        return;

      for (let i in this.roots) {
        let found = this.roots[i]._checkMouseIn(s.mouseX, s.mouseY);

        if (null != found) {
          if (this.ISSHIFT_DOWN) {
            found.showInput = true;
          } else {
            this.dragged = found;
            found.isDragged = true;
          }

        }
      }
      s.loop(1);
    }

    s.mouseReleased = () => {
      if (this.DOUBLE_CLICKED)
        return;


      if (null != this.dragged) {

        for (let j in this.roots) {
          let root = this.roots[j];
          let found = root._checkMouseIn(s.mouseX, s.mouseY);
          if (null == found || found.isDragged)
            continue;
          let target = found;


          if (target.figli.length == 0) {
            target.isRoot = false;
            this.dragged.isRoot = false;
            let oldPadreTarget = target.padre;
            let oldPadreDragged = this.dragged.padre;
            let newPadre = Elementt._builder(target.center.copy(), 75, "contenuto " + (s.frameCount % 1000),
              "gruppo " + (s.frameCount % 1000), this.sketchRef, this.rc, this.palettes, this);
            //this.createElementt(target.center.copy(), 40, "group" + (s.frameCount % 1000), "");

            let oldTargetOrder = target.orderInPadre;
            target.orderInPadre = 0;
            target.padre = newPadre;
            this.dragged.orderInPadre = 1;
            this.dragged.padre = newPadre;
            newPadre.figli.push(target);
            newPadre.figli.push(this.dragged);


            if (null != oldPadreTarget) {
              newPadre.isRoot = false;
              newPadre.padre = oldPadreTarget;
              newPadre.espanso = true;
              this.removeById(target.id, oldPadreTarget.figli);
              oldPadreTarget.figli.push(newPadre);

              newPadre.orderInPadre = oldTargetOrder;
              newPadre._applyChildStartPos();

            } else {
              newPadre.isRoot = true;
              newPadre.myColor = target.myColor;

              this.roots.push(newPadre);
            }
            if (null != oldPadreDragged) {
              this.removeById(this.dragged.id, oldPadreDragged.figli);
            }

          } else {
            this.dragged.isRoot = false;
            let oldPadreDragged = this.dragged.padre;
            this.dragged.padre = target;
            //target.espanso = false;
            this.dragged.myColor = target.myColor;
            target.figli.push(this.dragged);
            this.dragged.orderInPadre = target.figli.length - 1;
            if (null != oldPadreDragged) {
              this.removeById(this.dragged.id, oldPadreDragged.figli);
            }
            if (target.padre != null)
              target.padre._applyChildStartPos();
            else target._applyChildStartPos();


          }
        }

        this.dragged.isDragged = false;
        this.dragged = null;
        this.restoreRoots();
        this.updateRays();
        this.reorderChilds();
        //printAll();
        s.loop(1);

      }

    }


  }


  private inSketch(mouseX,mouseY,sketchRef) : boolean
  {
    // console.log(mouseX,mouseY,sketchRef.width,sketchRef.height);
    return mouseX < sketchRef.width && mouseY < sketchRef.height;
    
  }

  public espandiTutti = () =>
  {
    for (let elm of this.roots) {
      if(!elm.espanso)
        this.simulateCustomDoubleClick(elm.label);
    }
  }

  public chiudiTutti = () =>
  {
    for (let elm of this.roots) {
      if(elm.espanso)
        this.simulateCustomDoubleClick(elm.label);
    }
  }


  /*qui mettiamo tutte le variabili&funzioni necessarie allo sketch , globali in p5js,
  quindi di classe nel componente angular/ionic */

  url;
  palettes;
  rc;
  dragged = null;
  roots: Elementt[] = [];
  lastClick = 0;
  DOUBLE_CLICKED = false;
  allInputs = [];
  ININPUT = false;
  ISSHIFT_DOWN = false;
  sketchRef = undefined;
  button;

  initVariabiliGlobaliP5 = () => {
    this.url = "https://coolors.co/ffadad-ffd6a5-fdffb6-caffbf-9bf6ff-a0c4ff-bdb2ff-ffc6ff-f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0-f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1-f94144-f3722c-f8961e-f9c74f-90be6d-43aa8b-577590-ff595e-ffca3a-8ac926-1982c4-6a4c93";
    this.palettes = this.createPalette(this.url);
    this.lastClick = 0; //this.sketchRef.millis();
  }



  private createPalette = (_url) => {
    let slash_index = _url.lastIndexOf('/');
    let pallate_str = _url.slice(slash_index + 1);
    let arr = pallate_str.split('-');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = '#' + arr[i];
    }
    return arr;
  }

  private hideAllInputs = () => {
    this.allInputs.forEach(input => {
      input.position(-100, -100);
    });
  }

  private customDoubleClick = () => {

    for (let i in this.roots) {
      let found = this.roots[i]._checkMouseIn(this.sketchRef.mouseX, this.sketchRef.mouseY);
      if (null != found && !found.showInput) {

        found.espanso = !found.espanso;

        if (found.espanso) {
          found._applyChildStartPos();
        }
        this.downpaneComponent.identificaElementoSuDownpane(found.label);
        return;
      }
    }
  }

  public simulateCustomDoubleClick = (label: Elementt) => {

    let found = this.roots.find(elm => elm.label === label) 
    if (null != found && !found.showInput) {

      found.espanso = !found.espanso;

      if (found.espanso) {
        found._applyChildStartPos();
      }
      this.downpaneComponent.identificaElementoSuDownpane(found.label);
      return;
    }

  }

  private removeById = (id, els) => {

    for (let i in els) {
      if (id == els[i].id) {
        els.splice(i, 1);
      }
    }
    this.elementiService.aggiornaElementi(els);
  }


  private restoreRoots = () => {
    let newRoots = [];
    for (let i in this.roots) {
      if (this.roots[i].isRoot)
        newRoots.push(this.roots[i]);
      this.roots[i]._giveChildNewColor();
    }
    this.roots = newRoots;
    this.elementiService.aggiornaElementi(this.roots);
  }


  private applyChildStartPositions = () => {
    for (let i in this.roots) {
      this.roots[i]._applyChildStartPos();
    }
  }


  private updateRays = () => {
    for (let i in this.roots) {
      this.roots[i]._updateRay();
    }
  }

  private reorderChilds = () => {
    for (let i in this.roots) {
      this.roots[i]._reorderChilds();
    }
  }





  /*funzione builder oggetto di una classe
  che non e' una classe, ma e' modellato come js plain object
  poiche' veniamo da plain javascript.
  TODO: modellare element come classe typescript 
  */


  // private createElementt = (center, ray, text, label) => {
  //   if(!this.sketchRef)
  //   {
  //     console.log("this.sketchRef is undefined");
  //     return;
  //   }

  //   let element:any = {};
  //   element.center = center;
  //   element.ray = ray;
  //   element.text = text;
  //   element.label = label;
  //   element.id = Math.random()*50000;
  //   element.espanso = false;
  //   element.padre = null;
  //   element.isRoot = false;
  //   element.isDragged = false;
  //   element.internalAngleRotation = 0;
  //   element.figli = [];
  //   element.myColor =  this.sketchRef.random(this.palettes);//this.palettes[  Math.floor( Math.random()*this.palettes.length  ) ];
  //   element.goToCenter = center.copy();
  //   element.orderInPadre = 0;
  //   element.showInput = false;
  //   element.sketchRef = this.sketchRef;

  //   element.input = this.sketchRef.createInput(element.text);

  //   element.input.elt.addEventListener("input", function(event) {
  //     _this.text = event.target.value; 
  //   }, false);

  //   element.input.elt.addEventListener("mouseenter", function(event) { 
  //     this.ININPUT = true; 
  //   }, false);

  //   element.input.elt.addEventListener("mouseleave", function(event) {
  //     this.ININPUT = false;
  //     setTimeout(function() {
  //       if(!this.ININPUT)
  //         _this.showInput = false;
  //     }, 500);
  //   }, false);

  //   this.allInputs.push(element.input);


  //   var _this = element;

  //   element._draw = function() {

  //     //movement
  //     if (!_this.isDragged)
  //       _this.center = _this.sketchRef.createVector(_this.center.x + (_this.goToCenter.x - _this.center.x) * 0.1, _this.center.y + (_this.goToCenter.y - _this.center.y) * 0.1);

  //     //hide input as default
  //     //_this.input.style("opacity:0.1;"); DOES NOT WORK
  //     _this.input.position(-100, -100);


  //     //not to be draw (check to be sure)
  //     if (null != _this.padre && !_this.padre.espanso)
  //       return;

  //     if (_this.showInput) {
  //       _this.input.position(_this.center.x-50, _this.center.y - 10);
  //       _this.input.style("opacity:0.9;");
  //       _this.input.style("border-color:rgba(0,0,0,0.4);");
  //     }






  //     if (null != _this.padre) {

  //       _this.sketchRef.stroke(_this.padre.myColor);

  //       this.rc.line(_this.padre.center.x, _this.padre.center.y, _this.center.x, _this.center.y,{ 	 
  //       seed: 1,
  //       stroke: _this.figli.length > 0 ? "#000000" : _this.myColor  , strokeLineDash: [5,10]});
  //       /*rc.line(_this.padre.center.x, _this.padre.center.y, _this.center.x, _this.center.y,
  //               {stroke: _this.padre.myColor,
  //                strokeWidth : 1,
  //                bowing : 1});*/
  //     }


  //     if (_this.figli.length > 0 && _this.espanso) {
  //       for (let i in _this.figli) {
  //         _this.figli[i]._draw();
  //       }
  //     }

  //     _this.sketchRef.push();
  //     _this.sketchRef.translate(_this.center.x, _this.center.y);
  //     _this.sketchRef.noFill();
  //     //stroke(0, 255);
  //     //ellipseMode(CENTER);
  //     //stroke(0, 0, 0, 120);
  //     //fill(_this.myColor);
  //     //ellipse(0, 0, _this.ray, _this.ray);

  //     this.rc.circle(0, 0, _this.ray, {
  //       fill: _this.myColor,
  //       seed: 1,
  //       stroke: _this.figli.length > 0 ? "#000000" : _this.myColor,
  //     });
  //     _this.sketchRef.fill(0, 255);
  //     _this.sketchRef.textSize(12);
  //     _this.sketchRef.stroke(0, 255);
  //     _this.sketchRef.text(_this.text , 0, 0);
  //     _this.sketchRef.pop();
  //   }

  //   element._checkMouseIn = function(x, y) {
  //     if (_this.espanso && _this.figli.length > 0) {
  //       for (let i in _this.figli) {
  //         let found = _this.figli[i]._checkMouseIn(x, y);
  //         if (null != found) {
  //           return found;
  //         }
  //       }
  //     }

  //     if (_this.sketchRef.createVector(_this.center.x - x, _this.center.y - y).mag() < 0.5 * _this.ray) {
  //       return _this;
  //     }
  //     return null;
  //   }


  //   element._applyChildStartPos = function() {

  //     for (let i in _this.figli) {

  //       let childRay = _this.sketchRef.max(_this.ray, _this.figli[i].figli.length * 25); //map(_this.figli[i].figli.length, 0,5,1.5*_this.ray,20);
  //       let anglePorz = (_this.figli[i].orderInPadre) * _this.sketchRef.TWO_PI / _this.sketchRef.max(6, _this.figli.length);

  //       _this.figli[i].goToCenter = _this.sketchRef.createVector(_this.goToCenter.x + childRay * _this.sketchRef.cos(anglePorz),
  //         _this.goToCenter.y + childRay * _this.sketchRef.sin(anglePorz));
  //       _this.figli[i]._applyChildStartPos();
  //     }
  //   }

  //   element._updateRay = function() {
  //     _this.ray = _this.sketchRef.max(35, 20 * _this.figli.length);
  //     for (let i in _this.figli) {
  //       _this.figli[i]._updateRay();
  //     }
  //   }

  //   element._giveChildNewColor = function() {
  //     for (let ifig in _this.figli) {
  //       _this.figli[ifig]._updateElementClusterColor(_this.myColor);
  //     }
  //   }

  //   element._updateElementClusterColor = function(_newColor) {
  //     _this.myColor = _newColor;
  //     for (let ifig in _this.figli) {
  //       _this.figli[ifig]._updateElementClusterColor(_this.myColor);
  //     }
  //   }

  //   element._reorderChilds = function() {
  //     _this.figli.sort((a, b) => {
  //       if (a.orderInPadre > b.orderInPadre)
  //         return 1;
  //       else return -1;
  //     });
  //   }

  //   element._printMe = function() {
  //     console.log(_this.text);
  //     for (let i in _this.figli) {
  //       _this.figli[i]._printMe();
  //     }
  //   }
  //   return element;
  // }


}
