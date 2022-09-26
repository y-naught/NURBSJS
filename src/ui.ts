// Object for conotrolling the user interface that will be displayed on the webpage
// UI may include a canvas element to write to, a commandline, a command pallet, a layers menu, popups for settings,  etc...

import {File, saveFile, saveFileAs} from './file';

export class UI {

    canvas: unknown;
    cmd : CommandLine;


    constructor(){
        console.log("creating the UI object");
        this.cmd = new CommandLine();
    }
}

/**************  *******************/

class CommandLineOutput{

    log : String[];
    maxLength = 10000;

    constructor(){

        this.log = [];
    }

    append(text : String) : void {
        this.log.push(text);
        this.checkLength();
    }   

    checkLength() : void {
        if(this.log.length > this.maxLength){
            this.log.splice(0, 1);
        }
    }

    getLatestEntries(numEntries : number) : String[]{
        let tempArr : String[] = []
        for(let i = this.log.length; i < numEntries; i--){
            tempArr.push(this.log[i]);
        }
        return tempArr;
    }
}

//The command line that allows us to interact with the geometry engine
class CommandLine{

    input : String;
    textBox : HTMLInputElement;
    container : HTMLDivElement;
    outputContainer: HTMLDivElement;

    constructor(){
        console.log("generating Command Line");
        this.input = "";
        this.textBox = new HTMLInputElement();
        this.container = new HTMLDivElement();
        this.outputContainer = new HTMLDivElement();
        
    }

    //reach out to a verifier to run functions

}


/********* Constants where the names of the dropdown menu functions exist **************/


const fileDropDown = ["Save", "Save As", "Document Properties", "etc"];
const fileDropDownFunctions = [saveFile, saveFileAs];





/********************* Drop down menu ******************/

class DropDownItem{

    name : String;
    function : CallableFunction;

    constructor(n : String, fn : CallableFunction){
        this.name = n;
        this.function = fn;
    }
}

class DropDownMenu{

    name : String;
    container : HTMLDivElement;
    clss : String[];
    expanded : boolean;
    items : DropDownItem[];


    constructor(n : string, css? : String[]){
        this.name = n;
        this.container = new HTMLDivElement();
        if(css){
            this.clss = css;
        }else{
            this.clss = [];
        }
        this.expanded = false;
        this.container.addEventListener('onclick', this.toggleExpansion);
        this.items = this.constructDropdownItems(fileDropDown, fileDropDownFunctions);
    }

    toggleExpansion() : void {
        //directs
        if(!this.expanded){
            this.showItems();
        }else{
            this.hideItems();
        }
    }

    showItems(){
        //expands drop down menu

    }

    hideItems(){
        // retracts drop down menu

    }

    // takes a list of items that belong to the menu and their associated functions
    // should be added as parallel arrays in the order of which you want the list to appear
    constructDropdownItems(names : String[], functions : CallableFunction[]) : DropDownItem[]{
        let tempItems : DropDownItem[] = [];

        for(let i = 0; i < names.length; i++){
            tempItems.push(new DropDownItem(names[i], functions[i]))
        }

        return tempItems;
    }
}


class MenuBar {

    

    constructor(){

    }
}

// A UI element for us to accumulate tabs (defined below)
class SidePanel{


    constructor(){

    }
}

// A tab that allows us to manipulate layers
class LayerTab{
    

    constructor(){
        
    }
}

