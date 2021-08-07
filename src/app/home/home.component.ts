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
      s.background("#4a81a538"); //background come quello del container electron


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
      s.background("#000000");
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
      if (!this.inSketch(s.mouseX, s.mouseY, this.sketchRef)) {
        return;
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


  private inSketch(mouseX, mouseY, sketchRef): boolean {
    // console.log(mouseX,mouseY,sketchRef.width,sketchRef.height);
    return mouseX < sketchRef.width && mouseY < sketchRef.height;

  }

  public espandiTutti = () => {
    for (let elm of this.roots) {
      if (!elm.espanso)
        this.simulateCustomDoubleClick(elm.label,true);
    }
  }

  public chiudiTutti = () => {
    for (let elm of this.roots) {
      if (elm.espanso)
        this.simulateCustomDoubleClick(elm.label,true);
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
    //this.url = "https://coolors.co/ffadad-ffd6a5-fdffb6-caffbf-9bf6ff-a0c4ff-bdb2ff-ffc6ff-f72585-b5179e-7209b7-560bad-480ca8-3a0ca3-3f37c9-4361ee-4895ef-4cc9f0-f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1-f94144-f3722c-f8961e-f9c74f-90be6d-43aa8b-577590-ff595e-ffca3a-8ac926-1982c4-6a4c93";
    this.url = "https://coolors.com/048ba8-5f0f40-1b998b-9a031e-30638e-fb8b24-e36414-1982c4-0f4c5c-d100d1-31572c-fbff12-132a13-ffd6ff-2dc653-ead2ac-208b3a-fdc500-ffff3f-ff0a54-f3722c-43aa8b-660708-6a00f4-8ac926-415a77";
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

        if (found.espanso && found.justInitialized) {
           found._applyChildStartPos();
           found.justInitialized = false;
        }
        this.downpaneComponent.identificaElementoSuDownpane(found.label);
        return;
      }
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


   

  public resetChildsFor = (label: string) => {

    let found = this.roots.find(elm => elm.label === label)
    if (null != found && !found.showInput) { 
      if (found.espanso) {
        found._applyChildStartPos();
      } 

    }

  }


  public simulateCustomDoubleClick = (label: string, deep : boolean) => {

    let found = this.roots.find(elm => elm.label === label)
    if (null != found && !found.showInput) {

      found.espanso = !found.espanso; 
      if (deep && found.figli != undefined && found.figli.length > 0) {
        for (let figlio of found.figli) {
          this.espandi_deep(figlio)
        }
      }
       

    }

  }

  public espandi_deep = (elm: Elementt) => {

    elm.espanso = true;
    //elm._applyChildStartPos();

    if (elm.figli != undefined && elm.figli.length > 0) {
      for (let figlio of elm.figli) {
        this.espandi_deep(figlio)
      }
    }

  }
 

}
