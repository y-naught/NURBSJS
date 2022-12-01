// This is where the control flow for each UI command will live
// Each command will act as a binding between the renderer, the UI and the geometry engine

import {PointVector} from './pointVector.js'
import {Line} from './line.js'
import {CommandLine, CommandLineOutput} from './ui.js'
import { addGeometry, getGeometry, updateFrame } from './index.js';
import { Spline } from './spline.js';
import { Rectangle, Rectangle2Pt } from './rectangle.js';

export class Command{
    cmdName : string;
    output : CommandLineOutput;
    input : CommandLine;
    isComplete : boolean = false;
    
    constructor(_in : CommandLine, _out : CommandLineOutput, _name){
        this.output  = _out;
        this.input = _in;
        this.cmdName = _name;
    }

    update(_in :String){}
}


export class LineCommand extends Command{
    
    startPt : PointVector;
    endPt : PointVector;

    constructor(_in : CommandLine, _out : CommandLineOutput){
        super(_in, _out, "line");
        this.output.append("Enter the coordinates for the start point : format x,y,z");
    }

    update(_in : String){
        if(checkPointFormat(_in)){
            let coords : number[] = deconstructPoint(_in);
            this.output.append("Enter the coordinates for the end point : format x,y,z");
            if(!this.startPt){
                this.startPt = new PointVector(coords[0], coords[1], coords[2]);
            }else{
                this.endPt = new PointVector(coords[0], coords[1], coords[2]);
                let line = new Line(this.startPt, this.endPt);
                addGeometry(line);
                this.output.append("added line")
                updateFrame();
                //addGeometry(this.line);
                this.isComplete = true;
            }
            
        }else{
            this.output.append("The format for your point isn't correct : x,y,z")
        }
    }
}


export class CircleCNRCommand extends Command{
    // A circle can be thought of as a spline with a particular weights, knots format
    spline : Spline;
    w : number;
    step : number;
    center : PointVector;
    radius : number;


    constructor(_in : CommandLine, _out : CommandLineOutput){
        super(_in, _out, "circlecnr");
        this.output.append("Enter the coordinates for the center of the circle");
        this.step = 0;
        this.w = Math.pow(2, 0.5) / 2;
    }

    update(_in: String){
        if(this.step === 0){
            if(checkPointFormat(_in)){
                this.center = deconstructPointV(_in);
                this.step = 1;
                this.output.append("Enter a radius for you circle.");
            }else{
                this.output.append("Point Format incorrect. Format : x,y,z")
            }
        }else if(this.step === 1){
            if(checkScalarFormat(_in)){
                this.radius = Number(_in);
                let pt1 = new PointVector(this.center.value[0], this.center.value[1] + this.radius, this.center.value[2]);
                let pt2 = new PointVector(this.center.value[0] + this.radius, this.center.value[1] + this.radius, this.center.value[2]); 
                let pt3 = new PointVector(this.center.value[0] + this.radius, this.center.value[1], this.center.value[2]); 
                let pt4 = new PointVector(this.center.value[0] + this.radius, this.center.value[1] - this.radius, this.center.value[2]); 
                let pt5 = new PointVector(this.center.value[0], this.center.value[1] - this.radius, this.center.value[2]); 
                let pt6 = new PointVector(this.center.value[0] - this.radius, this.center.value[1] - this.radius, this.center.value[2]); 
                let pt7 = new PointVector(this.center.value[0] - this.radius, this.center.value[1], this.center.value[2]);  
                let pt8 = new PointVector(this.center.value[0] - this.radius, this.center.value[1] + this.radius, this.center.value[2]); 
                let pt9 = new PointVector(this.center.value[0], this.center.value[1] + this.radius, this.center.value[2]);
                
                let knots = [0,0,0,0.25,0.25,0.5,0.5,0.75,0.75,1,1,1];
                let degree = 2;
                let pts = [pt1, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9];
                let weights = [1, this.w, 1, this.w, 1, this.w, 1, this.w, 1];

                this.spline = new Spline(pts, knots, weights, degree);
                addGeometry(this.spline);
                this.output.append("adding circle");
                updateFrame();
                this.isComplete = true;

            }else{
                this.output.append("Please enter a single scalar (number)");
            }
        }
    }

}

export class Rectangle2Command extends Command{

    startPt : PointVector;
    endPt : PointVector;

    constructor(_in : CommandLine, _out : CommandLineOutput){
        super(_in, _out, "rect2pt");
        this.output.append("Enter Start Point for rectangle");
    }

    update(_in : String){
        if(checkPointFormat(_in)){
            let coords : number[] = deconstructPoint(_in);
            this.output.append("Enter the coordinates for the opposite corner, format : x,y,z");
            if(!this.startPt){
                this.startPt = new PointVector(coords[0], coords[1], coords[2]);
            }
            else{
                this.endPt = new PointVector(coords[0], coords[1], coords[2]);
                let rect = new Rectangle(this.startPt, this.endPt.value[0] - this.startPt.value[0], this.endPt.value[1] - this.startPt.value[1])
                addGeometry(rect);
                this.output.append("added rectangle");
                updateFrame();
                this.isComplete = true;
            }
        }else{
            this.output.append("The format for your point isn't correct : x,y,z");
        }
    }
}

export class MoveCommand extends Command{
    startPt : PointVector;
    endPt : PointVector;

    constructor(_in : CommandLine, _out : CommandLineOutput){
        super(_in, _out, "move");
        this.output.append("Enter Coordinates for the point to move from");
    }

    update(_in: String): void {
        if(checkPointFormat(_in)){
            let coords : number[] = deconstructPoint(_in);

            if(!this.startPt){
                this.startPt = new PointVector(coords[0], coords[1], coords[2]);
                this.output.append(this.startPt.value[0] + "," + this.startPt.value[1] + "," + this.startPt.value[2]);
                this.output.append("Enter Coordinates for the point to move to");
            }else{
                this.endPt = new PointVector(coords[0], coords[1], coords[2]);
                this.output.append(this.endPt.value[0] + "," + this.endPt.value[1] + "," + this.endPt.value[2]);
                let moveVector = this.endPt.subtract(this.startPt);
                let _g = getGeometry();
                for(let i = 0; i < _g.length; i++){
                    if(_g[i].isSelected()){
                        _g[i].translate(moveVector);
                    }
                }
                this.output.append("Moved all selected geometry");
                updateFrame();
                this.isComplete = true;
            }
        }else{
            this.output.append("Your point isn't valid. Format:  x,y,z");
        }
    }
}

export class PolygonCommand extends Command{
    center : PointVector;
    pts : PointVector[];
    kts : number[];
    wts : number[];
    degree : number;
    step : number;
    numSides : number;
    radius : number;

    constructor(_in : CommandLine, _out : CommandLineOutput){
        super(_in, _out, "Polygon");
        this.output.append("Enter the center point of the polygon : Format x,y,z");
        this.step = 0;
    }

    update(_in: string): void {
        if(this.step === 0){
            if(checkPointFormat(_in)){
                this.center = deconstructPointV(_in);
                this.output.append("Enter the number of sides for your polygon");
                this.step = 1;
            }else{
                this.output.append("Point format invalid. Format x,y,z");
            }
        }else if(this.step === 1){
            if(checkIntegerFormat(_in)){
                if(parseInt(_in) > 2){
                    this.numSides = parseInt(_in);
                    this.output.append("Enter the corner radius of the polygon");
                    this.step = 2;
                }else{
                    this.output.append("Number of sides must be greater than 2");
                }
            }else{
                this.output.append("Please enter an integer");
            }
        }else if(this.step === 2){
            if(checkScalarFormat(_in)){
                this.radius = Number(_in);
                //generate our spline
                //base point

                let xVector = new PointVector(this.radius, 0, 0);
                let basePoint = this.center.addUtil(xVector);
                
                this.pts = [] as any;
                this.wts = [] as any;
                this.kts = [] as any;

                for(let i = 0; i < this.numSides; i++){
                    let ang = i / this.numSides * (Math.PI * 2);
                    let tempPt = this.center.rotatePt(ang, this.radius);
                    this.pts.push(tempPt);
                    this.wts.push(1);
                    this.kts.push(i);
                }
                
                this.pts.push(basePoint);
                this.wts.push(1);
                this.kts.push(this.numSides);
                this.kts.push(this.numSides+1);

                this.degree = 1;

                let crv = new Spline(this.pts, this.kts, this.wts, this.degree);
                addGeometry(crv);
                this.output.append("Added polygon");
                updateFrame();
                this.isComplete = true;

            }else{
                this.output.append("Please enter a valid scalar");
            }
        }

    }
}

export class BoundingBoxCommand extends Command{

    minX : number;
    maxX : number;
    minY : number;
    maxY : number;

    constructor(_in : CommandLine, _out : CommandLineOutput){
        super(_in, _out, "Bounding Box");
        //initialize with unrealistic values
        this.minX = 100000000;
        this.maxX = -10000000;
        this.minY = 100000000;
        this.maxY = -100000000;
    }

    update(_in: String): void {
        let _g = getGeometry();
        let selectedInidices = [] as any;

        //collect the selected geometry
        for(let i = 0; i < _g.length; i++){
            if(_g[i].isSelected()){
                selectedInidices.push(i);
            }
        }
        console.log(selectedInidices);

        // find the min, max for each axis
        for(let i = 0; i < selectedInidices.length; i++){

            let numEvaluations = 1000;
            // approximate the bounds for each point 
            for(let j = 0; j < numEvaluations; j++){

                let _t = j / numEvaluations;
                let tempPt = _g[selectedInidices[i]].evaluate(_t);
                if(tempPt.value[0] < this.minX){
                    this.minX = tempPt.value[0];
                }
                if(tempPt.value[0] > this.maxX){
                    this.maxX = tempPt.value[0];
                }
                if(tempPt.value[1] < this.minY){
                    this.minY = tempPt.value[1];
                }
                if(tempPt.value[1] > this.maxY){
                    this.maxY = tempPt.value[1];
                }
            }
        }

        let pt1 = new PointVector(this.minX, this.minY, 0);
        let pt2 = new PointVector(this.maxX, this.maxY, 0);

        let rect = new Rectangle2Pt(pt1, pt2);

        addGeometry(rect);
        this.output.append("Generated Bounding Box");
        updateFrame();

        this.isComplete = true;
    }
}

/******Utility functions ********/

// user input validation checker for a point
function checkPointFormat(_in : String) : boolean{

    let indices : number[] = [];
    for(let i = 0; i < _in.length; i++){
        if(_in[i] === ','){
            indices.push(i);
        }
    }
    
    if(indices.length != 2){
        return false;
    }

    let xVal = _in.substring(0, indices[0]);
    let yVal = _in.substring(indices[0]+1, indices[1]);
    let zVal = _in.substring(indices[1]+1, _in.length);

    if(Number(xVal) != NaN && Number(yVal) != NaN && Number(zVal) != NaN){
        return true;
    }else{
        return false;
    }
}

// user input validation checker for a scalar
function checkScalarFormat(_in : String) : boolean{
    if(Number(_in) != NaN){
        return true
    }else{
        return false
    }
}

function checkIntegerFormat(_in : string) : boolean{
    if(parseInt(_in) != NaN){
        return true;
    }else{
        return false;
    }
}

// deconstructs a 3 Dimensional point from a string
// Must be validated first by the checkPointFormat function
function deconstructPoint(_in : String) : number[]{

    let indices : number[] = [];
    for(let i = 0; i < _in.length; i++){
        if(_in[i] === ','){
            indices.push(i);
        }
    }

    let xVal = _in.substring(0, indices[0]);
    let yVal = _in.substring(indices[0]+1, indices[1]);
    let zVal = _in.substring(indices[1]+1, _in.length);

    let res = [Number(xVal),Number(yVal),Number(zVal)];
    return res;
}

function deconstructPointV(_in : String) : PointVector{
    let indices : number[] = [];
    for(let i = 0; i < _in.length; i++){
        if(_in[i] === ','){
            indices.push(i);
        }
    }

    let xVal = _in.substring(0, indices[0]);
    let yVal = _in.substring(indices[0]+1, indices[1]);
    let zVal = _in.substring(indices[1]+1, _in.length);

    let res :  PointVector = new PointVector(Number(xVal),Number(yVal),Number(zVal));
    return res;
}

function constructPoint(x: number, y:number, z:number) : PointVector{
    let pt = new PointVector(x,y,z);

    return pt;
}