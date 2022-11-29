// This is where the control flow for each UI command will live
// Each command will act as a binding between the renderer, the UI and the geometry engine

import {PointVector} from './pointVector.js'
import {Line} from './line.js'
import {CommandLine, CommandLineOutput} from './ui.js'
import { addGeometry, getGeometry, updateFrame } from './index.js';
import { Spline } from './spline.js';
import { Rectangle } from './rectangle.js';

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
            }else{
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
        this.output.append("Enter Coordinates for the start of the move vector");
    }

    update(_in: String): void {
        if(checkPointFormat(_in)){
            let coords : number[] = deconstructPoint(_in);

            if(!this.startPt){
                this.startPt = new PointVector(coords[0], coords[1], coords[2]);
                this.output.append(this.startPt.value[0] + "," + this.startPt.value[1] + "," + this.startPt.value[2]);
                this.output.append("Enter Coordinates for the end of the move vector");
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