// Object for conotrolling the user interface that will be displayed on the webpage
// UI may include a canvas element to write to, a commandline, a command pallet, a layers menu, popups for settings,  etc...

import {File, saveFile, saveFileAs} from './file';
import { PointVector } from './pointVector.js';
import { Line } from './line.js';
import {CircleCNRCommand, Command, LineCommand, Rectangle2Command} from './command.js'
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
    

    constructor(){
        console.log("creating the UI object");
        this.cmdOutput = new CommandLineOutput();
        this.cmd = new CommandLine(this.cmdOutput);
        this.canvas = this.createCanvas();
        this.statusBar = new StatusBar();
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
        this.canvas.addEventListener("keydown", (event) => {
            if(event.key == "Escape"){
                let _g = getGeometry();
                for(let i = 0; i < _g.length; i++){
                    _g[i].setSelected(false);
                }
            }else if(event.key == "shift"){
                this.shiftHeld = true;
            }
        })

        this.canvas.addEventListener("keyup", (event) => {
            if(event.key == "shift"){
                this.shiftHeld = false;
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
                    + this.statusBar.getContainer().clientHeight; 

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

        this.log = [];
        this.container = document.createElement('div');
        this.container.setAttribute("id", "cmdOutContainer");
        this.lines = [];
        this.text = document.createElement('p');
        this.text.classList.add("cmdOutText");
        
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
        if(userInputLower == "point"){
            // run the point generating command
            let msg : String = "Running the point command"
            console.log(msg);
            this.output.append(msg);
        }
        else if(userInputLower == "line"){
            // runs the line command
            let msg : String = "Starting the line command";
            console.log(msg);
            this.output.append(msg);
            this.command = new LineCommand(this, this.output);
        }else if(userInputLower == "printgeom"){
            printGeom();
        }else if(userInputLower == "circle"){
            let msg : String = "Starting the circle command";
            this.output.append(msg);
            this.command = new CircleCNRCommand(this, this.output);
        }else if(userInputLower == "rectangle2"){
            let msg : String = "Starting the rectangle command";
            this.output.append(msg);
            this.command = new Rectangle2Command(this, this.output);
        }
        else if(userInputLower = "selnone"){
            let _g = getGeometry();
            for(let i = 0; i < _g.length; i++){
                _g[i].setSelected(false);
            }
            this.output.append("Selecting None");
            updateFrame();
        }
        else{
            let msg : String = "Command : \"" + userInput + "\" isn't recognized";
            console.log(msg);
            this.output.append(msg);
        }
    }
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


/*** Menu Bar is a place to accumulate drop down menus */
class MenuBar {

    

    constructor(){

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

