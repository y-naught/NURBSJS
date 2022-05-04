// controller class will make the connections betweenn the UI, the display, and the File Object
// The File Object will contain the references to all of the geometry objects, layer structures, and user settings
// In the main file you will create a single controller object and interface with the file 

import { File } from "./file.js";

export class controller {

    file: File;

    constructor(_f: File) {
        this.file = _f;
    }

    // getters by UUID

    

}