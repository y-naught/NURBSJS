// File for testing the functionaliity of the geometry engine of NURBSjs


import { PointVector } from "./pointVector.js";
import { Spline } from "./spline.js";
import { Line } from "./line.js";

function main() {

    //testPointVector();
    testSpline();
    //testLine();

}

// tests whether the evaluate line function is working properly
function testLine() {

    let s = GenerateRandomPointVector(50);
    let e = GenerateRandomPointVector(50);

    let line = new Line(s, e);

    let numPts = 10

    console.log("Start Point");
    console.log(s);

    console.log("End Point");
    console.log(e);

    for(let i = 0; i <= numPts; i++){
        let scale = i / numPts;
        console.log(`Scale: ${scale}`);


        let currentPoint = line.evaluate(scale);

        console.log(currentPoint);
    }
    
    console.log(`Line Length: ${line.length()} units`);

}

// tests whether the evaluation function on a spline is working properly
// which it's not...
function testSpline() {

    let pt = new PointVector(0,0,0);
    let pt2 = new PointVector(0,1,0);
    let pt3 = new PointVector(1,1,0);
    let pt4 = new PointVector(1,0,0);

    let kts = [0,0,0,0.25,0.45,1,1,1];
    let pts = [pt, pt2, pt3, pt4];
    let wts = [0.875,0.875,0.875];
    let deg = 3;

    let spl = new Spline(pts, kts, wts, deg);
    let point = spl.evaluate(0.5);
    console.log(point);
}

//running functions in console so that I can manually check the math. 
function testPointVector() {
    let pt = new PointVector(1,10,15);
    let pt2 = new PointVector(2,-3,5);
    let pt3 = new PointVector(-4,7,61);

    console.log("Point 1");
    console.log(pt);

    //functions that ammend the existing point
    console.log("Point 1: After adding")
    pt.add(pt2);
    console.log(pt);
    
    console.log("Point 1: After Scaling by 0.5");
    pt.scale(0.5);
    console.log(pt);

    console.log("Point 2");
    console.log(pt2);

    //functions that return a value or vector
    let magnitude = pt.magnitude();
    let angle = pt.angle(pt2);
    let dot = pt.dot(pt2);
    let cross = pt.cross(pt2);
    let unitVector = pt.unit();
    

    console.log(`Magnitude: ${magnitude}`);
    console.log(`Angle: ${angle}`);
    console.log(`Dot: ${dot}`);

    console.log("Cross Product of point 1 and point 2");
    console.log(cross);

    console.log("Unit vector of Point 1");
    console.log(unitVector);

    console.log("Point 3");
    console.log(pt3);

    pt.translate(pt3);
    console.log("Point 1: Translated by Point 3");
    console.log(pt);
}

function GenerateRandomPointVector(max: number) : PointVector {

    let x = Math.random() * max;
    let y = Math.random() * max;
    let z = Math.random() * max;

    return new PointVector(x, y, z);
}

main();