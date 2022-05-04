// This creates an object that will be owned by the file object for each file. 
// This will store things like viewport properties, document units, tolerance, etc.

export class Properties {

    units: string;
    
    constructor(){
        this.units = "inches";
    }
}