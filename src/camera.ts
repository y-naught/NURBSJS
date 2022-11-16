import { TranslationMatrix } from "./matrixUtils";
import { PointVector } from "./pointVector";
import { UI } from "./ui";

// Camera object will do all the translation necessary for 
// translating the position of our geometry on our 2D canvas
export class Camera2D{

    location : PointVector;
    locationTemp : PointVector;
    focalLength : number;
    pitch : number;
    roll : number;
    yaw : number;
    isMoving : boolean

    constructor(){

        this.location = new PointVector(0,0,0);
        this.locationTemp = new PointVector(0,0,0);
        this.focalLength = 35;
        this.pitch = 0;
        this.roll = 0;
        this.yaw = 0;
    }

    move(vec : PointVector) : void{
        this.locationTemp = this.location.addUtil(vec);
    }

    getRenderTranslation(ui : UI) : PointVector{
        let _w = ui.getCanvas().width;
        let _h = ui.getCanvas().height;

        let midX = _w / 2;
        let midY = _h / 2;

        let x : number;
        let y : number;

        if(this.isMoving){
            x = midX + this.locationTemp.value[0];
            y = midY + this.locationTemp.value[1]; 
        }else{
            x = midX + this.location.value[0];
            y = midY + this.location.value[1]; 
        }

        return new PointVector(x, y, 0);
    }

    getScaleVector(){
        return new PointVector(1,-1,1);
    }

    getBounds(ui : UI){
        let _w = ui.getCanvas().width;
        let _h = ui.getCanvas().height;

        let xStart : number;
        let xEnd : number;
        let yStart : number;
        let yEnd : number;

        if(this.isMoving){
            xStart = -this.locationTemp.value[0] - _w/2;
            xEnd = -this.locationTemp.value[0] + _w/2;
            yStart = this.locationTemp.value[1] - _h/2;
            yEnd = this.locationTemp.value[1] + _h/2;
        }else{
            xStart = -this.location.value[0] - _w/2;
            xEnd = -this.location.value[0] + _w/2;
            yStart = this.location.value[1] - _h/2;
            yEnd = this.location.value[1] + _h/2;
        }
        console.log("this.location : ");
        console.log(this.locationTemp.value);
        console.log("_w :", _w);
        console.log("_h :", _h);

        let arr = [xStart, xEnd, yStart, yEnd];

        //console.log(arr);

        return arr;
    }

    startMove(){
        this.isMoving = true;
    }

    stopMove(){
        this.isMoving = false;
        this.location = this.locationTemp;
    }
}