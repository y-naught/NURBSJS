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

        let x = midX + this.location.value[0];
        let y = midY + this.location.value[1]; 

        return new PointVector(x, y, 0);
    }

    getScaleVector(){
        return new PointVector(1,-1,1);
    }

    getBounds(ui : UI){
        let _w = ui.getCanvas().width;
        let _h = ui.getCanvas().height;

        let xStart = this.location.value[0] - _w/2;
        let xEnd = this.location.value[0] + _w/2;
        let yStart = this.location.value[1] - _h/2;
        let yEnd = this.location.value[1] + _h/2;

        return [xStart, xEnd, yStart, yEnd]
    }
}