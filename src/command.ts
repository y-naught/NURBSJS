// This is where the control flow for each UI command will live
// Each command will act as a binding between the renderer, the UI and the geometry engine

import {PointVector} from './pointVector.js'
import {Line} from './line.js'
import {CommandLine, CommandLineOutput} from './ui.js'
import { addGeometry, updateFrame } from './index.js';

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
    
    line : Line;
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
                console.log("endPt");
                console.log(this.endPt);
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

// user input validation checker
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

function constructPoint(x: number, y:number, z:number) : PointVector{
    let pt = new PointVector(x,y,z);

    return pt;
}