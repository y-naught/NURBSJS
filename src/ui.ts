// Object for conotrolling the user interface that will be displayed on the webpage
// UI may include a canvas element to write to, a commandline, a command pallet, a layers menu, popups for settings,  etc...

import {File, saveFile, saveFileAs} from './file';
import { PointVector } from './pointVector.js';
import { Line } from './line.js';
import {BoundingBoxCommand, CircleCNRCommand, Command, LineCommand, MoveCommand, PointCommand, PolygonCommand, Rectangle2Command} from './command.js'
import { updateFrame, printGeom, getGeometry  } from '.';
import { Geometry } from './geometry';
import {Camera2D} from './camera';


export class UI {

    canvas: HTMLCanvasElement;
    cmd : CommandLine;
    cmdOutput : CommandLineOutput;
    statusBar : StatusBar;
    mousePos : number[];
    mousePosStart : number[];
    isDragging : boolean = false;
    mouseRightDown : boolean = false;
    mouseLeftDown : boolean = false;
    mouseMidDown : boolean = false;
    shiftHeld : boolean = false;
    camera : Camera2D;
    selectedGeometry : Geometry[];
    selectionTolerance : number = 1;
    menuBar : MenuBar;
    

    constructor(){
        this.cmdOutput = new CommandLineOutput();
        this.cmd = new CommandLine(this.cmdOutput);
        this.canvas = this.createCanvas();
        this.statusBar = new StatusBar();
        this.menuBar = new MenuBar();
        this.mousePos = [0,0];
        this.setCanvasMouseListeners();
        this.setResizeListener();
        this.setCanvasRightClickListener();
        this.setCanvasKeyListeners();
    }

    getCanvasContext(){
        return this.canvas.getContext('2d');
    }

    createCanvas():HTMLCanvasElement {
        let canvas: HTMLCanvasElement = document.createElement("CANVAS") as HTMLCanvasElement;
        canvas.setAttribute("width", "1000");
        canvas.setAttribute("height", "1000");
        canvas.setAttribute("id", "viewport");
        return canvas;
    }

    getCanvas() : HTMLCanvasElement {
        return this.canvas;
    }

    getCMDContainer() : HTMLDivElement {
        return this.cmd.getContainer();
    }

    getCMDOutputContainer() : HTMLDivElement {
        return this.cmdOutput.getContainer();
    }

    getStatusContainer() : HTMLDivElement {
        return this.statusBar.getContainer();
    }

    getMenuContainer() : HTMLDivElement {
        return this.menuBar.getContainer();
    }

    setCanvasMouseListeners() : void{
        this.canvas.addEventListener("mousemove", (event) => {
            this.mousePos = this.getMousePosition(event);
            
            let translatedPoint = this.camera.getRenderTranslation(this);

            this.statusBar.setXCoordinate(this.mousePos[0] - translatedPoint.getX());
            this.statusBar.setYCoordinate(translatedPoint.getY() - this.mousePos[1]);
        })

        this.canvas.addEventListener("mousedown", (event) => {
            this.mousePosStart = this.getMousePosition(event);
            switch(event.button){
                case 0:
                    // left mouse button
                    this.mouseLeftDown = true;
                    break;
                case 1:
                    // middle mouse button
                    this.mouseMidDown = true;
                    break;
                default:
                    // right mouse button:
                    console.log("mouse right down!")
                    
                    this.mouseRightDown = true;
                    this.camera.startMove();
            }
        })

        this.canvas.addEventListener("mouseup", (event) => {

            // TODO 
            // Click selection system appears to be broken for pointvector selection

            //this.mousePosStart = this.getMousePosition(event);
            switch(event.button){
                case 0:
                    // left mouse button, select geometry
                    this.mouseLeftDown = false;
                    this.isDragging = false;
            
                    let translationVector = this.camera.getRenderTranslation(this);

                    // check to see if the user tried to click on an object
                    // create a point vector where the user clicked
                    let clickPoint = new PointVector(this.mousePos[0] - translationVector.getX(), translationVector.getY() - this.mousePos[1], 0);

                    let curGeometry = getGeometry();

                    let closestIndex = -1;
                    let closestDistance = 1000000;
                    let clickTolerance = 10;
                    // check the distance between the closest point of all the geometry objects
                    for(let i = 0; i < curGeometry.length; i++){
                        
                        let pointInfo = curGeometry[i].closestPoint(clickPoint);
                        let curDistance = pointInfo[0].distance(clickPoint);
                        console.log("curDistance : ", curDistance);
                        if(curDistance < closestDistance){
                            closestIndex = i;
                            closestDistance = curDistance;
                        }
                    }
                    // if the closest one is within a click tolerance, mark the object as selected
                    
                    if(!this.shiftHeld){
                        let _g = getGeometry();
                        for(let i = 0; i < _g.length; i++){
                            _g[i].setSelected(false);
                        }
                    }
                    if (closestDistance < clickTolerance && closestIndex != -1){
                        curGeometry[closestIndex].setSelected(true);
                    }
                    // update the frame
                    updateFrame();
                    break;
                case 1:
                    // middle mouse button
                    this.mouseMidDown = false;
                    break;
                default:
                    // right mouse button:
                    console.log("mouse Right up!")
                    this.mouseRightDown = false;
                    this.camera.stopMove();
            }
        })

        this.canvas.addEventListener("mousemove", (event) => {
            
            if(this.mouseLeftDown){
                this.isDragging = true;
            }
            if(this.mouseRightDown){
                console.log("dragging right!")
               if(!this.camera){
                  console.log("camera hasn't been attached");
               }else{
                 let moveVector = new PointVector(this.mousePos[0] - this.mousePosStart[0], this.mousePos[1] - this.mousePosStart[1], 0);
                 this.camera.move(moveVector);
                 this.updateCanvas();
               }
            }
        })
    }

    setCanvasKeyListeners(){
        document.addEventListener("keydown", (event) => {
            if(event.key === "Escape"){
                let _g = getGeometry();
                for(let i = 0; i < _g.length; i++){
                    _g[i].setSelected(false);
                }
            }else if(event.key === "Shift"){
                this.shiftHeld = true;
                console.log("shift Down")
            }
        })

        document.addEventListener("keyup", (event) => {
            if(event.key === "Shift"){
                this.shiftHeld = false;
                console.log("Shift Up");
            }
        })
    }

    attachCamera(cam:  Camera2D){
        this.camera = cam;
    }

    getMousePosition(event : MouseEvent) : number[]{
        let canvasRect = this.canvas.getBoundingClientRect();
        let x = event.clientX - canvasRect.left;
        let y = event.clientY - canvasRect.top;
        let coords : number[] = [x,y];
        return coords;
    }

    updateCanvas(){
        updateFrame();
    }

    setCanvasSize(){
        // calculate the other windows taking up all the space
        // and find the remaining space it can take up
        let h = window.innerHeight;
        let w = window.innerWidth;
        let takenHeight = 0;
        let takenWidth = 0;
        
        takenHeight = this.cmd.getContainer().clientHeight 
                    + this.cmdOutput.getContainer().clientHeight 
                    + this.statusBar.getContainer().clientHeight
                    + this.menuBar.getContainer().clientHeight; 

        this.canvas.width = w - takenWidth;
        this.canvas.height = h - takenHeight;

        this.updateCanvas()
    }

    selectGeometry(){
        if(this.isDragging){
            // select anything within the rectangle of mousePosStart, mousePos
        }else{
            // selects anything within a tolerance of 
        }
        this.mousePosStart;
        this.mousePos;
        
        
    }

    setResizeListener(){
        window.addEventListener('resize', (event) => {
            this.setCanvasSize();
        }, true)
    }

    setCanvasRightClickListener(){
        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        })
    }
}

/************** Acts as our console output and a history of commands *******************/

export class CommandLineOutput{

    log : String[];
    lines : HTMLBRElement[];
    maxLength : number = 10000;
    container : HTMLDivElement;
    text : HTMLParagraphElement;
    fontSize : number = 20 //in pixels

    constructor(){

        this.log = ["Welcome to NURBS.js! If you need help visit the user manual at http://www.nurbsjs.com/manual.html"];
        this.container = document.createElement('div');
        this.container.setAttribute("id", "cmdOutContainer");
        this.lines = [];
        this.text = document.createElement('p');
        this.text.classList.add("cmdOutText");
        this.updateHTML();
        
        this.container.appendChild(this.text);
    }

    append(text : String) : void {
        this.log.push(text);
        this.checkLength();
        this.updateHTML();
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

    updateHTML() : void {
        this.text.innerHTML = "";
        this.constructText();
        this.container.scrollTop = this.fontSize*this.log.length;
    }

    constructText() : void{
        for(let i = 0; i < this.log.length; i++){
            this.text.innerHTML = this.text.innerHTML + "<br>" + this.log[i];
        }
    }

    getContainer() : HTMLDivElement{
        return this.container;
    }

    print(str : String) : void {
        this.append(str);
    }
}

//The command line that allows us to interact with the geometry engine
export class CommandLine{

    input : String;
    textBox : HTMLInputElement;
    container : HTMLDivElement;
    output: CommandLineOutput;
    command : Command;

    constructor(_output : CommandLineOutput){
        console.log("generating Command Line");
        this.input = "";
        this.textBox = document.createElement("input");
        this.container = document.createElement("div");
        this.output = _output;
        this.container.setAttribute("id", "cmdLineContainer");
        this.textBox.setAttribute("id", "cmdLineInput");
        this.setInputListener();
        this.container.appendChild(this.textBox);
    }

    //reach out to a verifier to run functions

    getContainer() : HTMLDivElement{    
        return this.container;
    }

    setInputListener(){
        this.textBox.addEventListener("keydown", (event) => {
                if(this.command){
                    if(this.command.isComplete){
                        this.command = null;
                    }
                }
            
                //try and run a command if they press enter
                if(event.key === "Enter" || event.key === "NumpadEnter"){
                    console.log("Enter has been pressed");
    
                    //Add our command checker here
                    if(!this.command){
                        this.runCommand(this.input);
                        this.textBox.value = "";
                    }else{
                        this.command.update(this.input);
                        this.textBox.value = "";
                    }
                }
                else if(event.key == "Backspace"){
                    
                }
                else if(event.key == "Escape" || event.key == "esc"){
                    let _g = getGeometry();
                    for(let i = 0; i < _g.length; i++){
                        _g[i].setSelected(false);
                    }
                    console.log("Selecting None");
                }
                //append key to the input variable
                else{
                    this.input = this.textBox.value + event.key;
                    console.log("Our input string is : ", this.input)
                }
        })
    }

    runCommand(userInput:  String){
        let userInputLower = userInput.toLowerCase();
        // TODO complete this
        if(userInputLower == "point"){
            // run the point generating command
            let msg = "Starting Point Command";
            this.output.append(msg);
            this.command = new PointCommand(this, this.output);
        }
        else if(userInputLower == "line"){
            // runs the line command
            let msg : String = "Starting the line command";
            console.log(msg);
            this.output.append(msg);
            this.command = new LineCommand(this, this.output);
        }
        else if(userInputLower == "printgeom"){
            printGeom();
        }
        else if(userInputLower == "circle"){
            let msg : String = "Starting the circle command";
            this.output.append(msg);
            this.command = new CircleCNRCommand(this, this.output);
        }
        else if(userInputLower == "rectangle2"){
            let msg : String = "Starting the rectangle command";
            this.output.append(msg);
            this.command = new Rectangle2Command(this, this.output);
        }
        else if(userInputLower == "selnone"){
            let _g = getGeometry();
            for(let i = 0; i < _g.length; i++){
                _g[i].setSelected(false);
            }
            this.output.append("Selecting None");
            updateFrame();
        }
        else if(userInputLower == "move"){
            let _g = getGeometry();
            let index = 0;
            let somethingSelected = false;

            //check to see if there is anything selected
            while(index < _g.length){
                if(_g[index].isSelected()){
                    somethingSelected = true;
                    break;
                }
                index+=1;
            }
            
            // TODO
            // This should be handled inside the move command where it could prompt the user to select objects
            // without cancelling the command
            if(somethingSelected){
                let msg = "Running the move command";
                this.output.append(msg);
                this.command = new MoveCommand(this, this.output);
            }else{
                let msg = "Nothing is selected! Please Select your geometry before running the move command"
            }
        }
        else if(userInputLower == "polygon"){
            let msg = "Starting Polygon Command";
            this.output.append(msg);
            this.command = new PolygonCommand(this, this.output);
        }
        else if(userInputLower == "boundingbox"){

            // TODO
            // I need to figure out how to force close the command so the user doesn't have to press
            // enter twice 
            let _g = getGeometry();
            let somethingSelected = false;
            let index = 0;

            while(!somethingSelected && index < _g.length){
                if(_g[index].isSelected()){
                    somethingSelected = true;
                    break;
                }
                index++;
            }

            if(somethingSelected){
                let msg = "Starting Bounding Box Command";
                this.output.append(msg);
                this.command = new BoundingBoxCommand(this, this.output);
                //this.runCommand();
            }else{
                let msg = "Please select some goemetry before running the bounding box command";
                this.output.append(msg);
            }
        }
        else{
            let msg : String = "Command : \"" + userInput + "\" isn't recognized";
            console.log(msg);
            this.output.append(msg);
        }
    }
}





/********* Constants where the names of the dropdown menu functions exist **************/

const fileDropDown = ["Save", "Save As", "Document Properties", "import"];
const fileDropDownFunctions = [saveFile, saveFileAs];

const testFileDropDown = ["Save", "Save As"];


/********************* Drop down menu ******************/

class DropDownItem{

    name : string;
    function : CallableFunction;
    container : HTMLDivElement;
    text : HTMLElement;
    clss : string[];

    constructor(n : string, fn : CallableFunction, eleType : string, css? : string[]){
        this.name = n;
        this.function = fn;
        this.container=  document.createElement("div");
        this.text = document.createElement(eleType);
        this.text.innerHTML = this.name;
        if(css){
            this.clss = css;
        }else{
            this.clss = [];
        }
        for(let i = 0; i < this.clss.length; i++){
            this.text.classList.add(this.clss[i]);
        }
        this.container.appendChild(this.text);
        this.container.addEventListener("click", () => (this.function()));
    }

    getContainer() : HTMLDivElement{
        return this.container;
    }

    getElement() : HTMLElement{
        return this.text;
    }
}

class DropDownMenu{

    name : string;
    container : HTMLDivElement;
    dropDownContainer : HTMLDivElement;
    clss : string[];
    expanded : boolean;
    items : DropDownItem[];
    title : HTMLParagraphElement;


    constructor(n : string, css : string[]){
        this.name = n;
        this.container = document.createElement("div");
        this.dropDownContainer = document.createElement("div");
        this.dropDownContainer.classList.add("dropdown-content");
        this.container.classList.add("dropdown-button");
        if(css){
            this.clss = css;
        }else{
            this.clss = [];
        }
        this.title = document.createElement("p");
        this.title.innerHTML = this.name;
        this.title.classList.add("menuText");
        this.title.classList.add("dropdown-button");
        this.container.appendChild(this.title);
        this.expanded = false;
        this.constructDropdownItems(testFileDropDown, fileDropDownFunctions, ["p", "p"], ["menuText"]);
    }

    

    showItems(){
        //expands drop down menu

    }

    hideItems(){
        // retracts drop down menu

    }

    getContainer() : HTMLDivElement{
        return this.container;
    }

    getDropDownContainer() : HTMLDivElement{
        return this.dropDownContainer;
    }

    // takes a list of items that belong to the menu and their associated functions
    // should be added as parallel arrays in the order of which you want the list to appear
    constructDropdownItems(names : string[], functions : CallableFunction[], eleTypes : string[], clss? : string[]) {
        let tempItems : DropDownItem[] = [];

        for(let i = 0; i < names.length; i++){
            tempItems.push(new DropDownItem(names[i], functions[i], eleTypes[i], clss));
        }

        this.items = tempItems;
    }

    constructContainer() : void{

        for(let i = 0; i < this.items.length; i++){
            this.items[i].getContainer().classList.add("dropdown-content-container");
            this.dropDownContainer.appendChild(this.items[i].getContainer());
        }
    }
}


/*** Menu Bar is a place to accumulate drop down menus */
class MenuBar {

    menus : DropDownMenu[];
    container : HTMLDivElement;


    constructor(){
        const fileMenu = new DropDownMenu("File", ["dropDownMenu"]);
        //fileMenu.constructDropdownItems(["save"], [saveFile], ["p"]);
        fileMenu.constructContainer();
        this.menus = []
        this.menus.push(fileMenu);
        this.container = document.createElement("div");
        this.container.classList.add("dropdown");

        for (let i = 0; i < this.menus.length; i++){
            this.container.appendChild(this.menus[i].getContainer());
            this.container.appendChild(this.menus[i].getDropDownContainer());
        }
    }

    getContainer() : HTMLDivElement{
        return this.container;
    }
}


/**** Sits at the bottom of the canvas
 *    provides access to quick options (object snaps, ortho, gumball, etc)
 *    shows your mouse location or object location
 */
class StatusBar {

    container : HTMLDivElement;
    xCoordinate : HTMLParagraphElement;
    yCoordinate : HTMLParagraphElement;

    constructor(){
        this.container = document.createElement('div');
        this.container.setAttribute("id", "StatusBarContainer");

        this.xCoordinate = document.createElement('p');
        this.xCoordinate.classList.add("statusText");
        this.yCoordinate = document.createElement('p');
        this.yCoordinate.classList.add("statusText");

        this.container.appendChild(this.xCoordinate);
        this.container.appendChild(this.yCoordinate);
    }

    getContainer() : HTMLDivElement {
        return this.container;
    }

    setXCoordinate(num : number) : void{
        this.xCoordinate.innerHTML = "x : " + num.toString();
    }

    setYCoordinate(num : number) : void{
        this.yCoordinate.innerHTML = "y : " + num.toString();
    }
}




// A UI element for us to accumulate tabs (defined below)
class SidePanel{


    constructor(){

    }
}

// contains common tab attributes
interface Tab {

}

// A tab that allows us to manipulate layers
class LayerTab{
    

    constructor(){
        
    }
}

