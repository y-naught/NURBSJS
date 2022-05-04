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
    evaluate(t: number): number {
        // temporary, input evaluate proedure here...
        let tempVal: number = t;
        //evalulate the point on the curve given the value passed in on the curve domain

        let closestKnotIndex = this.getClosestKnotIndex(t);


        return closestKnotIndex;
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


}