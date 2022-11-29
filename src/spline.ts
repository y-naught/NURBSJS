// This class is an implementation of a non-uniform rational B-Spline
// This class will be used as the basis for creating surfaces, polysurfaces, extrusions, and boundary representations.
// Each spline will reference point vectors that create the spline. This will allow for easy modification of the spline by the UI

import {PointVector} from './pointVector.js';
import {Geometry} from './geometry.js';

export class Spline extends Geometry {

    points: PointVector[];
    knots: number[];
    weights: number[];
    degree: number;

    constructor(_pts: PointVector[], _kts: number[], _w: number[], _d: number){

        super();

        this.points = _pts;
        this.knots = _kts;
        this.weights = _w;
        this.degree = _d;
    }

    isValid(): boolean{
        //checks to see if the curve is valid as defined
        //list of points is equal
        if(this.points.length !== this.weights.length){
            console.log("The number of points does not match the number of weights");
            return false;
        }
        //if degree of curve is greater than the total number of points the curve is made of
        else if(this.degree > this.points.length){
            console.log("degree of this curve is greater than the number of points provided");
            return false;
        }else {
            return true;
        }
    }

    
    /*
        https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/de-Boor.html
        cs.drexel.edu/~david/Classes/CS430/Lectures/L-09_BSplines_NURBS.pdf
    */
   
    evaluate(t: number): PointVector {
        let tempVal: number = t;
        //evalulate the point on the curve given the value passed in on the curve domain

        //padding the knot vector if necessary
        if(this.knots.length < this.points.length + this.degree + 1){
            let numShort = (this.points.length + this.degree + 1) - this.knots.length;
            for(let i = 0; i < numShort; i++){
                this.knots.push(this.knots[this.knots.length-1]);
            }
        }

        let domain = [
            this.degree,
            (this.knots.length - 1) - this.degree
        ];

        let lowVal = this.knots[domain[0]];
        let highVal =  this.knots[domain[1]];
        

        tempVal = tempVal * (highVal - lowVal) + lowVal;

        // the starting segment we are evaluating in between
        let s : number;

        for(s = domain[0]; s < domain[1]; s++){
            if(tempVal >= this.knots[s] && tempVal <= this.knots[s+1]) {
                break;
            }
        }

        // converting to our homogenous coordinates system
        let v;
        v = new Array<number[]>(4);
        for(let i = 0; i < this.points.length; i++){
            v[i] = new Array<number>(4);
            //assumes we are working in 3 dimensions
            v[i][0] = this.points[i].value[0] * this.weights[i];
            v[i][1] = this.points[i].value[1] * this.weights[i];
            v[i][2] = this.points[i].value[2] * this.weights[i];
            v[i][3] = this.weights[i];
        }

        //some homoogennous coordinates witchcraft
        let alpha : number;
        for(let l = 1; l <= this.degree+1; l++){
            for(let i = s; i > s-this.degree-1+l; i--){
                alpha = (tempVal - this.knots[i]) / (this.knots[this.degree + i + 1 - l] - this.knots[i]);
                for(let j = 0; j < 4; j++){
                    v[i][j] = (1 - alpha) * v[i-1][j] + alpha * v[i][j];
                }
            } 
        }

        let res : PointVector;
        let tempX : number = v[s][0] / v[s][3];
        let tempY : number = v[s][1] / v[s][3];
        let tempZ : number = v[s][2] / v[s][3];
        
        res = new PointVector(tempX, tempY, tempZ);

        return res;
    }

    getClosestKnotIndex(_t: number): number {
        let closestKnot = this.knots[0];
        let difference = Math.abs(_t - closestKnot);
        let index = 0;

        for(let knot = 0; knot < this.knots.length; knot++){
            console.log(knot);
            let distance = Math.abs(_t - this.knots[knot]);
            if(distance <= difference){
                difference = distance;
                index = knot;
            }
        }

        return index;
    }

    isClosestKnotGreater(_t: number, index: number): boolean {
        if(_t > this.knots[index]){
            return true;
        }else {
            return false;
        }
    }

    translate(_v : PointVector){
        for(let i = 0; i < this.points.length; i++){
            this.points[i].translate(_v);
        }
    }

    scale(factor : number){
        for(let i = 0; i < this.points.length; i++){
            this.points[i].scale(factor);
        }
    }

    render(samples: number): PointVector[]{
        let pts: PointVector[] = new Array<PointVector>();
        for(let i = 0; i < samples + 1; i++){
            let _t = i / samples;
            pts.push(this.evaluate(_t));
        }
        return pts;
    }

    // TODO
    // running a divide and conquer method until we find a more exact closest point
    // is likely a lot more efficient, explore this
    closestPoint(_pt) : [PointVector, number]{
        let tolerance = 0.001;
        let curPt = new PointVector(0,0,0);
        let curT = 0;
        let curDistance = 1000000000;

        // scan 1000 points on the line and record closest one
        for(let i = 0; i <= 1; i=i+tolerance){
            let tempPt = this.evaluate(i);
            let dist = tempPt.distance(_pt);

            if(dist < curDistance){
                curPt = tempPt;
                curT = i;
                curDistance = dist;
            }
        }

        // nudge the points in each direction by some tolerance and record the closest point again
        let nudgeTolerance= 0.00001;

        let ptNegative = this.evaluate(curT + nudgeTolerance);
        let ptPositive = this.evaluate(curT - nudgeTolerance);

        let distNegative = ptNegative.distance(_pt);
        let distPositive = ptPositive.distance(_pt);

        // TODO : This is not an exact method, needs audited to make sure we are returning the closest value
        // now push it by another tolerance until we get to our closest point
        if(distNegative < distPositive){
            let inflected = false;
            let tempT = curT - nudgeTolerance;
            let lastDist = distNegative;

            while(!inflected){
                curPt = this.evaluate(tempT);
                let curDist = curPt.distance(_pt);

                if(curDist < lastDist){
                    inflected = false;
                    lastDist = curDist;
                    tempT -= nudgeTolerance;
                    curT = tempT
                }else{
                    inflected = true;
                }
            }
        }else{
            let inflected = false;
            let tempT = curT + nudgeTolerance;
            let lastDist = distPositive;

            while(!inflected){
                curPt = this.evaluate(tempT);
                let curDist = curPt.distance(_pt);
                if(curDist < lastDist){
                    inflected = false;
                    lastDist = curDist;
                    tempT += nudgeTolerance;
                    curT = tempT;
                }else{
                    inflected = true;
                }
            }
        }

        return [curPt, curT];
    }
}