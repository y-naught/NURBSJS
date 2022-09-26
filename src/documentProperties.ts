// This creates an object that will be owned by the file object for each file. 
// This will store things like viewport properties, document units, tolerance, etc.

export class Properties {

    units: String;
    grid : number[];
    
    constructor(){
        this.units = "inches";
        //num of minor grid lines, how many until a major grid line
        this.grid = [100, 10];
    }

    getUnits() : String {
        return this.units;
    }

    getGrid() : number[] {
        return this.grid;
    }

    setUnits(_units : String){
        this.units = _units;
    }

    setGrid(major : number, minor : number){
        this.grid = [major, minor];
    }
}