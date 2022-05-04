// This is the aggregate object which stores all of the geometry and is 
// referenced when we want to display, add, remove, or modify geometry objects.

import { Geometry } from "./geometry";
import { Properties } from "./documentProperties";


export class File {

    geometry: Geometry[];
    fileName: string;
    hasChanges: boolean;
    documentProperties: Properties;

    constructor(_name: string, _prop: Properties){
        this.geometry = Array<Geometry>();
        this.fileName = _name;
        this.hasChanges = true;
        this.documentProperties = _prop;
    }

    saveFile(){
        if(this.hasChanges){
            //save the file changes here
            console.log("Changes have been saved");
        }else{
            console.log("There are no changes to save");
        }
    }

    add(_g: Geometry){
        this.geometry.push(_g);
    }

    //remove will require a key-based system that can identify geometry objects by their UUID
    //remove(_g: Geometry){}

    // modify method (may fork into multiple methods) will allow us to perform modifications on
    // a paricular geometry in our list
    //modify(_g: Geometry){}



    //edit document properties
    

}

