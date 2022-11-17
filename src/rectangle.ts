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
}