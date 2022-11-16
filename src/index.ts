// the starting point for the web tester
// this is an attempt at creating a basic renderer that writes directly to canvas frame pixels
import {PointVector} from "./pointVector.js";
import {Line} from "./line.js";
import { Geometry } from "./geometry.js";
import { Spline } from "./spline.js";
import { UI } from "./ui.js"
import { Renderer } from "./renderer.js";
import { Camera2D } from "./camera.js";

let geom: Geometry[] = new Array<Geometry>();
let ui = constructUI();
let renderer = new Renderer();
let camera = new Camera2D();
ui.attachCamera(camera);


let pt = new PointVector(0,250,0);
let pt2 = new PointVector(0,250,0);
let pt3 = new PointVector(0,500,0);
let pt4 = new PointVector(250, 500,0);
let pt5 = new PointVector(500,500,0);
let pt6 = new PointVector(500,250,0);
let pt7 = new PointVector(500,0,0);
let pt8 = new PointVector(250,0,0);
let pt9 = new PointVector(0,0,0);

//let kts = [0,0,0,0,1,1,1,1,1];
//let kts = [0,1,2,3,4,5,6,7,8,9,10,11,12];
let kts = [0,0,0,0.25,0.25,0.5,0.5,0.75,0.75,1,1,1];
let pts = [pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9, pt];
let wts = [1.0,0.707107,1,0.707107,1,0.707107,1,0.707107,1.0];
let deg = 2;

function main() {
    
    // Where we construct out webpage components from
    document.body.appendChild(ui.getCMDOutputContainer());
    document.body.appendChild(ui.getCMDContainer());
    document.body.appendChild(ui.getCanvas());
    document.body.appendChild(ui.getStatusContainer());
    

    //let lines: Line[] = generateLines(25, canvas.width, canvas.height);

    let spline : Spline = createSpline(pts, kts, wts, deg);
    let moveVector = new PointVector(50, 50,0);
    spline.translate(moveVector);
    spline.scale(1.2);

    ui.setCanvasSize();
    

    // for(let i = 0; i < lines.length; i++){
    //     geom.push(lines[i]);
    // }
    geom.push(spline);
    renderer.writeFrame(ui, geom, camera);
}



//**** Utility functions for testing or convienence ***********/
function generateLines(numLines: number, wid: number, ht: number): Line[]{
    let lines: Line[] = new Array<Line>();
    for(let i = 0; i < numLines; i++){
        let x1 = 0;
        let y1 = 1000 * i / (numLines-1);
        let x2 = wid;
        let y2 = ht - y1;
        let _pStart = createPoint(x1, y1);
        let _pEnd = createPoint(x2, y2);
        let _line = createLine(_pStart, _pEnd);
        lines.push(_line);
    }
    return lines;
}


function createSpline(pt: PointVector[], kt : number[], wt : number[], deg : number){
    let spline = new Spline(pt, kt, wt, deg);
    return spline;
} 

// creates a line and returns the object to be called by a renderer
function createLine(s: PointVector, e: PointVector): Line {
    let line: Line = new Line(s,e);
    return line;
}

//for now we are only working in 2D space. 
function createPoint(x: number, y: number): PointVector{
    let pt: PointVector = new PointVector(x, y, 0);
    return pt;
}

function constructUI() : UI {
    let _UI = new UI();
    return _UI;
}


// Access functions for the UI or command line manager to call
export function addGeometry(g : Geometry){
    geom.push(g);
}

export function printGeom(){
    for(let i = 0; i < geom.length; i++){
        console.log(geom[i]);
        }
}

export function updateFrame() : void {
    renderer.writeFrame(ui, geom, camera);
}



main();