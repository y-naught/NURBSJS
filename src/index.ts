// the starting point for the web tester
// this is an attempt at creating a basic renderer that writes directly to canvas frame pixels
import {PointVector} from "./pointVector.js";
import {Line} from "./line.js";
import { Geometry } from "./geometry.js";
import { Spline } from "./spline.js";
import { UI } from "./ui.js"

let geom: Geometry[] = new Array<Geometry>();
let ui = constructUI();


let pt = new PointVector(1,1,0);
let pt2 = new PointVector(1,250,0);
let pt3 = new PointVector(1,500,0);
let pt4 = new PointVector(250, 500,0);
let pt5 = new PointVector(500,500,0);
let pt6 = new PointVector(500,250,0);
let pt7 = new PointVector(500,1,0);
let pt8 = new PointVector(250,1,0);
let pt9 = new PointVector(1,1,0);

//let kts = [0,0,0,0,1,1,1,1,1];
let kts = [0, 0, 0, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 1.0, 1.0, 1.0];
let pts = [pt, pt2, pt3, pt4, pt5, pt6, pt7, pt8, pt9];
let wts = [1.0,0.707107,1,0.707107,1,0.707107,1,0.707107,1.0];
let deg = 4;

function main() {
    

    document.body.appendChild(ui.getCMDOutputContainer());
    document.body.appendChild(ui.getCMDContainer());
    document.body.appendChild(ui.getCanvas());
    document.body.appendChild(ui.getStatusContainer());
    

    //let lines: Line[] = generateLines(25, canvas.width, canvas.height);

    let spline : Spline = createSpline(pts, wts, kts, deg);
    
    ui.setCanvasSize();
    

    // for(let i = 0; i < lines.length; i++){
    //     geom.push(lines[i]);
    // }
    //geom.push(spline);

    writeFrame(ui, geom);
    
}

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


function createSpline(pt: PointVector[], wt : number[], kt : number[], deg : number){
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

export function addGeometry(g : Geometry){
    geom.push(g);
}

export function printGeom(){
    for(let i = 0; i < geom.length; i++){
        console.log(geom[i]);
        }
}



function writeFrame(ui: UI, g: Geometry[]): void {
    let context = ui.getCanvasContext()

    let imageData = context!.getImageData(0,0,ui.getCanvas().width, ui.getCanvas().height);

    let pointsToWrite: PointVector[] = new Array<PointVector>();

    for(let index = 0; index < g.length; index++){
        let tempPts: PointVector[] = g[index].render(1000.0);
        for(let i = 0; i< tempPts.length; i++){
            //console.log(tempPts[i]);
            pointsToWrite.push(tempPts[i]);
        }
    }

    for(let i = 0; i < pointsToWrite.length; i++){
        let px = pixelLocation(pointsToWrite[i], ui.getCanvas().width, ui.getCanvas().height);
        setPixelToBlack(px, imageData);
    }

    context!.putImageData(imageData, 0, 0);
}

export function updateFrame() : void {
    writeFrame(ui, geom);
}


function constructUI() : UI {
    let _UI = new UI();
    return _UI;
}

function setPixelToBlack(loc: number, imageData: ImageData): void {
    imageData.data[loc  ] = 0;
    imageData.data[loc+1] = 0;
    imageData.data[loc+2] = 0;
    imageData.data[loc+3] = 255;
}


// function to return the index of the pixel you are looking to set
// by default the array is 1D - this is our 2D to 1D translation
function pixelLocation(pt: PointVector, w: number, h:number): number{
    return (pt.getY() * w * 4) + (pt.getX() * 4);
}

main();