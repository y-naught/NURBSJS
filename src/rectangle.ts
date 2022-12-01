import { Geometry } from "./geometry";
import { PointVector } from "./pointVector";
import { Spline } from "./spline";


export class Rectangle extends Geometry {

    curve : Spline;

    constructor(anchorPoint : PointVector, width : number, height : number){
        super();
        
        let wVector = new PointVector(width, 0, 0);
        let hVector = new PointVector(0 , height, 0);

        let pt1 = anchorPoint;
        let pt2 = pt1.addUtil(wVector);
        let pt3 = pt1.addUtil(wVector).addUtil(hVector);
        let pt4 = pt1.addUtil(hVector);
        let pt5 = anchorPoint;
        
        let pts : PointVector[] = [pt1, pt2, pt3, pt4, pt5];
        let wts : number[] = [1,1,1,1,1];
        let deg : number = 1;
        let knots : number[] = [0,1,2,3,4,5,6];

        this.curve = new Spline(pts, knots, wts, deg);
    }

    evaluate(_t){
        return this.curve.evaluate(_t);
    }

    render(samples : number) : PointVector[]{
        return this.curve.render(samples);
    }

    closestPoint(_pt) : [PointVector, number]{
        return this.curve.closestPoint(_pt);
    }
}

// TODO
// Overload the constructor for the Rectangle class rather than creating a new class
export class Rectangle2Pt extends Geometry {
    
    curve : Spline;

    constructor(_pt1 : PointVector, _pt2 : PointVector){
        super();

        let x1 = _pt1.value[0];
        let y1 = _pt1.value[1];
        let z1 = _pt1.value[2];
        let x2 = _pt2.value[0];
        let y2 = _pt2.value[1];
        let z2 = _pt2.value[2];

        let pt1 = new PointVector(x1, y1, z1);
        let pt2 = new PointVector(x1, y2, z1);
        let pt3 = new PointVector(x2, y2, z2);
        let pt4 = new PointVector(x2, y1, z2);
        let pt5 = new PointVector(x1, y1, z1);

        let pts : PointVector[] = [pt1, pt2, pt3, pt4, pt5];
        let wts : number[] = [1,1,1,1,1];
        let deg : number = 1;
        let knots : number[] = [0,1,2,3,4,5,6];

        this.curve = new Spline(pts, knots, wts, deg);
    }

    evaluate(_t){
        return this.curve.evaluate(_t);
    }

    render(samples : number) : PointVector[]{
        return this.curve.render(samples);
    }

    closestPoint(_pt) : [PointVector, number]{
        return this.curve.closestPoint(_pt);
    }
}