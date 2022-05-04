// the starting point for the web tester
// this is an attempt at creating a basic renderer that writes directly to canvas frame pixels
import {PointVector} from "./pointVector.js";
import {Line} from "./line.js";
import { Geometry } from "./geometry.js";


function main() {
    let canvas: HTMLCanvasElement = createCanvas();
    document.body.appendChild(canvas);

    let lines: Line[] = generateLines(25, canvas.width, canvas.height);

    let geom: Geometry[] = new Array<Geometry>();

    for(let i = 0; i < lines.length; i++){
        geom.push(lines[i]);
    }
    

    writeFrame(canvas, geom);

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


function writeFrame(canvas: HTMLCanvasElement, g: Geometry[]): void {
    let context = canvas.getContext('2d');

    let imageData = context!.getImageData(0,0,canvas.width, canvas.height);

    let pointsToWrite: PointVector[] = new Array<PointVector>();

    for(let index = 0; index < g.length; index++){
        let tempPts: PointVector[] = g[index].render(1000);
        for(let i = 0; i< tempPts.length; i++){
            pointsToWrite.push(tempPts[i]);
        }
    }

    for(let i = 0; i < pointsToWrite.length; i++){
        let px = pixelLocation(pointsToWrite[i], canvas.width, canvas.height);
        setPixelToBlack(px, imageData);
    }

    context!.putImageData(imageData, 0, 0);

}

function createCanvas():HTMLCanvasElement {
    let canvas: HTMLCanvasElement = document.createElement("CANVAS") as HTMLCanvasElement;
    canvas.setAttribute("width", "1000");
    canvas.setAttribute("height", "1000");
    canvas.setAttribute("id", "viewport");
    return canvas;
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