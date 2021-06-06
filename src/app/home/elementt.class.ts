export class Elementt {

    public id = Math.random() * 50000;
    public espanso = false;
    public padre = null;
    public isRoot = false;
    public isDragged = false;
    public internalAngleRotation = 0;
    public figli = [];
    public myColor = null;
    public goToCenter = null;
    public orderInPadre = 0;
    public showInput = false;
    public input = null;

    constructor(public center, public ray, public text, public label,
        public sketchRef, public rcRef, public colorPalettes, public mainClassRef) {
        this.goToCenter = center.copy();
        this.myColor = this.sketchRef.random(this.colorPalettes);//this.palettes[  Math.floor( Math.random()*this.palettes.length  ) ];
        this.input = this.sketchRef.createInput(this.text);

        this.input.elt.addEventListener("input", (event) => {
            this.text = event.target.value;
        }, false);

        this.input.elt.addEventListener("mouseenter", (event) => {
            mainClassRef.ININPUT = true;
        }, false);

        this.input.elt.addEventListener("mouseleave", (event) => {
            mainClassRef.ININPUT = false;
            setTimeout(function () {
                if (!this.ININPUT)
                    this.showInput = false;
            }, 500);
        }, false);

        mainClassRef.allInputs.push(this.input);

    }

    public _draw = () => {

        //movement
        if (!this.isDragged)
            this.center = this.sketchRef.createVector(this.center.x + (this.goToCenter.x - this.center.x) * 0.1, this.center.y + (this.goToCenter.y - this.center.y) * 0.1);

        //hide input as default
        //_this.input.style("opacity:0.1;"); DOES NOT WORK
        this.input.position(-100, -100);


        //not to be draw (check to be sure)
        if (null != this.padre && !this.padre.espanso)
            return;

        if (this.showInput) {
            this.input.position(this.center.x - 50, this.center.y - 10);
            this.input.style("opacity:0.9;");
            this.input.style("border-color:rgba(0,0,0,0.4);");
        }






        if (null != this.padre) {

            this.sketchRef.stroke(this.padre.myColor);

            this.rcRef.line(this.padre.center.x, this.padre.center.y, this.center.x, this.center.y, {
                seed: 1,
                stroke: this.figli.length > 0 ?  this.myColor : this.myColor, strokeLineDash: [5, 10]
            });
            /*rc.line(_this.padre.center.x, _this.padre.center.y, _this.center.x, _this.center.y,
                    {stroke: _this.padre.myColor,
                     strokeWidth : 1,
                     bowing : 1});*/
        }


        if (this.figli.length > 0 && this.espanso) {
            for (let i in this.figli) {
                this.figli[i]._draw();
            }
        }

        this.sketchRef.push();
        this.sketchRef.translate(this.center.x, this.center.y);
        this.sketchRef.noFill();
        //stroke(0, 255);
        //ellipseMode(CENTER);
        //stroke(0, 0, 0, 120);
        //fill(_this.myColor);
        //ellipse(0, 0, _this.ray, _this.ray);

        this.rcRef.circle(0, 0, this.ray, {
            fill: this.myColor,
            seed: 1,
            stroke: this.figli.length > 0 ? "#000000" : this.myColor,
        });
        this.sketchRef.fill(255, 255);
        this.sketchRef.textSize(12);
        this.sketchRef.stroke(255, 255);
        this.sketchRef.text(this.text, 0, 0);
        this.sketchRef.pop();
    }

    public _checkMouseIn = (x, y) => {
        console.log("__checkMouseIn");
        if (this.espanso && this.figli.length > 0) {
            for (let i in this.figli) {
                let found = this.figli[i]._checkMouseIn(x, y);
                if (null != found) {
                    return found;
                }
            }
        }
        
        if (this.sketchRef.createVector(this.center.x - x, this.center.y - y).mag() < 0.5 * this.ray) {
            console.log("__checkMouseIn no figli "+ (this.sketchRef.createVector(this.center.x - x, this.center.y - y).mag() )+","+( 0.5 * this.ray));
            return this;
            
        }
        return null;
    }

    public _applyChildStartPos = () => {
        for (let i in this.figli) {

            let childRay = this.sketchRef.max(this.ray, this.figli[i].figli.length * 30); //map(_this.figli[i].figli.length, 0,5,1.5*_this.ray,20);
            let anglePorz = (this.figli[i].orderInPadre) * this.sketchRef.TWO_PI / this.sketchRef.max(6, this.figli.length);

            this.figli[i].goToCenter = this.sketchRef.createVector(this.goToCenter.x + childRay * this.sketchRef.cos(anglePorz),
                this.goToCenter.y + childRay * this.sketchRef.sin(anglePorz));
            this.figli[i]._applyChildStartPos();
        }
    }

    public _updateRay = () => {
        this.ray = this.sketchRef.max(50, 30 * this.figli.length);
        for (let i in this.figli) {
            this.figli[i]._updateRay();
        }
    }

    public _giveChildNewColor = () => { 
        for (let ifig in this.figli) {
            this.figli[ifig]._updateElementClusterColor(this.myColor);
        }
    }

    public _updateElementClusterColor = (_newColor) => { 
        this.myColor = _newColor;
        for (let ifig in this.figli) {
            this.figli[ifig]._updateElementClusterColor(this.myColor);
        }
    }

    public _reorderChilds = () => {
        this.figli.sort((a, b) => {
            if (a.orderInPadre > b.orderInPadre)
                return 1;
            else return -1;
        });
     }


 
  


    public static _builder = (center, ray, text, label,
        sketchRef, rcRef, colorPalettes, mainClassRef): Elementt => {

        if (!sketchRef) {
            console.log("this.sketchRef is undefined");
            return;
        }
        let nuovoElemento = new Elementt(center, ray, text, label, sketchRef, rcRef, colorPalettes, mainClassRef);

        return nuovoElemento;
    }
}


 
 
