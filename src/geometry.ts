
// base class for any geometry object
// where layers uuid and other file and structure references will be handled
// for each individual geometry
// 

import {v4 as uuidv4} from 'uuid';
import {PointVector} from "./pointVector.js";


export class Geometry {
    
    id: unknown;
    layer: string;
    
    constructor () {
        this.id = uuidv4();
        this.layer = "default"
    }

    //prototype function necessary for the frame generator to call on each type of geometry to render
    render(samples: number): PointVector[]{
        let arr: PointVector[] = new Array<PointVector>();
        return arr;
    }
}

