// This defines the Layer class, we will use layers to group geometry objects for the ease of organization of a model


import { Geometry } from "./geometry.js";


export class Layer extends Geometry {

    name: string;
    geometry: Geometry[];
    // figure out how to deal with this chicken and egg nonsense
    // solution will likely be to implement a master layer that has no parent property
    // parent: Layer;
    // children: Layer[];


    constructor(_n: string, _parent?: Layer){
        super();
        this.name = _n;
        this.geometry = Array<Geometry>();
        
    }

    rename(newName: string) {
        if(this.isValidName(newName)){
            this.name = newName;
        }else {
            console.log("Name must be greater than 0 characters and less than 64 characters. Failed to edit name.")
        }
    }

    isValidName(_val: string){
        if(_val.length > 0 && _val.length < 64){
            return true;
        }else{
            return false;
        }
    }

    //addChild(_Layer): void {}

    //removeChild(_Layer): void {}


}