// A representation of a line between two point vectors.
// I expect this function to simply be a utility for evaluating splines
// The lines the user will create will be splines of a degree of 1

import { Geometry } from "./geometry.js";
import { PointVector } from "./pointVector.js";

export class Line extends Geometry {

    start: PointVector;
    end: PointVector;

    constructor(_pt1: PointVector, _pt2: PointVector){
        super();
        this.start = _pt1;
        this.end = _pt2;
    }

    evaluate(t: number): PointVector{

        let movementVector = this.end.subtract(this.start);

        movementVector.scale(t);

        let tempPoint = this.start.addUtil(movementVector);

        return tempPoint;
    }

    render(samples: number): PointVector[]{
        let pts: PointVector[] = new Array<PointVector>();
        for(let i = 0; i < samples + 1; i++){
            let _t = i / samples;
            pts.push(this.evaluate(_t));
        }
        return pts;
    }

    getStartPoint(): PointVector {
        return this.start;
    }

    getEndPoint(): PointVector {
        return this.end;
    }

    length(): number {
        return this.end.subtract(this.start).magnitude();
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