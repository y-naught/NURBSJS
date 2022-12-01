
// base class for any geometry object
// where layers uuid and other file and structure references will be handled
// for each individual geometry
// 

import {v4 as uuidv4} from 'uuid';
import {PointVector} from "./pointVector.js";


export class Geometry {
    
    id: unknown;
    layer: string;
    selected : boolean;
    
    constructor () {
        this.selected = false;
        this.id = uuidv4();
        this.layer = "default"
    }

    //prototype functions necessary for the frame generator to call on each type of geometry to render
    render(samples: number): PointVector[]{
        let arr: PointVector[] = new Array<PointVector>();
        return arr;
    }

    closestPoint(_pt) : [PointVector, number]{
        return [new PointVector(0,0,0), -1];
    }

    setSelected(_val : boolean){
        this.selected = _val;
    }

    isSelected() : boolean{
        return this.selected;
    }

    translate(_v : PointVector) : void{

    }

    evaluate(_t : number) : PointVector{
        return new PointVector(0,0,0);
    }
}

