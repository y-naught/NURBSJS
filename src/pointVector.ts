// Defines the class for pointvector object. 
// This will be the base of the geometry hierarchy
// All transformation matrices will be defined and aplied within this class
// other classes that are made up of PointVectors will batch transformations on groups of stored points.


import {Geometry} from './geometry.js';
import {ScaleMatrix, TranslationMatrix} from './matrixUtils.js';

export class PointVector extends Geometry{

    value: number[];

    constructor (_x: number, _y: number, _z: number) {
        super();
        this.value = [_x, _y, _z, 1];
    }

    getX(): number {
        return Math.round(this.value[0]);
    }

    getY(): number {
        return Math.round(this.value[1]);
    }
    

    // constructs matrix and applies a translation transformation to a pointVector
    translate(_v: PointVector) {
        let tempMatrix: TranslationMatrix = new TranslationMatrix(_v);
        let tempPoint: number[] = tempMatrix.multiply(this);
        this.value = tempPoint;
    }

    // constructs matrix and applies a scale transformation to a pointVector
    scale(factor: number) {
        //this needs refactored to handle more general cases
        let scaleVector = new PointVector(factor, factor, factor);
        let tempMatrix: ScaleMatrix = new ScaleMatrix(scaleVector);
        let newCoordinates: number[] = tempMatrix.multiply(this);
        this.value = newCoordinates;
    }

    scaleVector(scaleVector : PointVector) : void{
        let tempMatrix : ScaleMatrix = new ScaleMatrix(scaleVector);
        let newCoordinates : number[] = tempMatrix.multiply(this);
        this.value = newCoordinates;
    }

    // adds two pointvectors together
    add(_v: PointVector): void {
        let tempNumbers: number[] = 
        [
            this.value[0] + _v.value[0],
            this.value[1] + _v.value[1],
            this.value[2] + _v.value[2],
            1
        ];

        this.value = tempNumbers;
    }

    // adds two vectors, but returns the associated vector rather than ammending this object that is calling it
    // used as a utility function for calculating points along lines and splines
    addUtil(_v: PointVector): PointVector {
        let result: number[] = 
        [
            this.value[0] + _v.value[0],
            this.value[1] + _v.value[1],
            this.value[2] + _v.value[2],
            1
        ];

        return new PointVector(result[0], result[1], result[2]);
    }


    // subtracts a given vector from itself
    // returns a value because this is being used as a utility for the line class
    subtract(_v: PointVector): PointVector {
        let result: number[] = [
            this.value[0] - _v.value[0],
            this.value[1] - _v.value[1],
            this.value[2] - _v.value[2]
        ];
        return new PointVector(result[0], result[1], result[2])
    }

    // calculates the dot product between two pointvectors
    dot(_v: PointVector): number {
        let tempNumber: number;
        tempNumber = this.value[0] * _v.value[0] + this.value[1] * _v.value[1] + this.value[2] * _v.value[2];
        return tempNumber;
    }

    // calculates the angle between two vectors in radians
    angle(_v: PointVector): number {
        let dot = this.dot(_v);
        let mag = this.magnitude() * _v.magnitude();
        return Math.acos(dot / mag);
    }

    // calculates the magnitued of the vector
    magnitude(): number {
        return Math.sqrt(this.value[0] * this.value[0] + this.value[1] * this.value[1] + this.value[2] * this.value[2]);
    }

    // calculates the cross product of two vectors
    cross(_v: PointVector): PointVector {
        let tempX: number = (this.value[1] * _v.value[2]) - (this.value[2] * _v.value[1]);
        let tempY: number = (this.value[2] * _v.value[0]) - (this.value[0] * _v.value[2]);
        let tempZ: number = (this.value[0] * _v.value[1]) - (this.value[1] * _v.value[0]);
        return new PointVector(tempX, tempY, tempZ);
    }

    // returns a unitVector in the same direction as itself
    unit(): PointVector {
        let mag = this.magnitude();
        let tempX = this.value[0] / mag;
        let tempY = this.value[1] / mag;
        let tempZ = this.value[2] / mag;
        return new PointVector(tempX, tempY, tempZ);
    }

    inBounds(bounds : number[]){
        
        console.log(this.value);
        console.log("bounds : ")
        console.log(bounds);

        if(this.value[0] < (bounds[0]) || this.value[0] > (bounds[1])){
            console.log("false on X!");
            return false;
        }else if(this.value[1] < bounds[2] || this.value[1] > bounds[3]){
            console.log("false on Y!");
            return false;
        }else{
            return true;
        }
    }
}