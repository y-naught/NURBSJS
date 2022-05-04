// Matrix utils is a math utility for the common 4x4 matrix multiplications we have to do. 
// Each type of transformation matrix will get a different class so we can effectively use the constructors 
// to generate a matrix structured for the given transformation operation.

import {PointVector} from './pointVector.js';

export class TransformationMatrix {

    //the matrix stored
    matrix: number[][];


    constructor() {
        this.matrix = 
        [
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
        ]
    }

    multiply(point: PointVector): number[] {

        //perform matrix multiplication of the 4x4 matrix and the 4x1 point
        let tempX: number = this.matrix[0][0] * point.value[0]
                          + this.matrix[0][1] * point.value[1]
                          + this.matrix[0][2] * point.value[2]
                          + this.matrix[0][3] * point.value[3];
        
        let tempY: number = this.matrix[1][0] * point.value[0]
                          + this.matrix[1][1] * point.value[1]
                          + this.matrix[1][2] * point.value[2]
                          + this.matrix[1][3] * point.value[3];

        let tempZ: number = this.matrix[2][0] * point.value[0]
                          + this.matrix[2][1] * point.value[1]
                          + this.matrix[2][2] * point.value[2]
                          + this.matrix[2][3] * point.value[3];
        
        // probably unnecessary, but will leave for now
        let tempW: number = this.matrix[3][0] * point.value[0]
                          + this.matrix[3][1] * point.value[1]
                          + this.matrix[3][2] * point.value[2]
                          + this.matrix[3][3] * point.value[3];


        //returns the new coordinates of the resultant vector
        return [tempX, tempY, tempZ, tempW];
    }

}

export class ScaleMatrix extends TransformationMatrix {
    //figure out a general solution for this problem
    constructor(vector: PointVector = new PointVector(1,1,1)) {
        super()
        super.matrix = 
        [
            [vector.value[0],0,0,0],
            [0,vector.value[1],0,0],
            [0,0,vector.value[2],0],
            [0,0,0,1]
        ]
    }
}

export class TranslationMatrix extends TransformationMatrix {
    constructor(vector: PointVector = new PointVector(1,1,1)) {
        super()
        super.matrix = 
        [
            [1,0,0,vector.value[0]],
            [0,1,0,vector.value[1]],
            [0,0,1,vector.value[2]],
            [0,0,0,1]
        ]
    }
}

export class RotationMatrix extends TransformationMatrix {
    //some work needs to be done to figure out a general solution to this problem
    constructor(axis: PointVector, angle: number){
        super();
        super.matrix = 
        [
            [1,0,0,axis.value[0]],
            [0,1,0,axis.value[1]],
            [0,0,1,axis.value[2]],
            [0,0,0,1]
        ]
    }
}


//must define a plane class first before we can implement this
// export class ProjectionMatrix extends TransformationMatrix {
//     //find the math associated with projecting onto a specific plane
//     constructor(plane: Plane){}
// }
