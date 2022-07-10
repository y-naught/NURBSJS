// Object for conotrolling the user interface that will be displayed on the webpage
// UI may include a canvas element to write to, a commandline, a command pallet, a layers menu, popups for settings,  etc...

export class UI {

    canvas: unknown;
    cmd : CommandLine;


    constructor(){
        console.log("creating the UI object");
        this.cmd = new CommandLine();
    }
}

//The command line that allows us to interact with the geometry engine
class CommandLine{

    input : String;

    constructor(){
        console.log("generating Command Line");
        this.input = "";
    }


}

// A UI element for us to accumulate tabs (defined below)
class SidePanel{

}

// A tab that allows us to manipulate layers
class LayerTab{

}

