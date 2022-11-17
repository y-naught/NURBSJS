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
}