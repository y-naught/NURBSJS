import { UI } from "./ui";
import { Geometry } from "./geometry";
import { PointVector } from "./pointVector";
import { Camera2D } from "./camera";
import { Line } from "./line";
import { TranslationMatrix } from "./matrixUtils";

export class Renderer{

    xAxisColor : ColorRGBA;
    yAxisColor : ColorRGBA;
    selectedColor : ColorRGBA;

    constructor(){
        this.xAxisColor = new ColorRGBA(255,0,0,255);
        this.yAxisColor = new ColorRGBA(0,255,0,255);
        this.selectedColor = new ColorRGBA(255,255,0, 255);
    }

    //writes a frame to canvas. 
    // This function will begin to accumulate functions as the complexity
    // of the renderer increases
    writeFrame(ui : UI, g: Geometry[], cam : Camera2D){
        let context = ui.getCanvasContext()
        this.clearCanvas(context, ui);
        let imageData = context!.getImageData(0,0,ui.getCanvas().width, ui.getCanvas().height);

        // Where we apply renders
        this.drawAxes(imageData, cam, ui);
        this.renderGeometry(imageData, g, ui, cam);

        context!.putImageData(imageData, 0, 0);
    }

    clearCanvas(ctx : CanvasRenderingContext2D, ui : UI){
        ctx.clearRect(0,0, ui.getCanvas().width, ui.getCanvas().height);
    }

    drawAxes(img : ImageData, cam : Camera2D, ui : UI){
        let scaleVector = cam.getScaleVector();
        let translationVector = cam.getRenderTranslation(ui);

        let cameraBounds : number[] = cam.getBounds(ui);

        let xStart = new PointVector(cameraBounds[0],0,0);
        let xEnd = new PointVector(cameraBounds[1],0,0);
        let yStart = new PointVector(0,cameraBounds[2],0);
        let yEnd = new PointVector(0,cameraBounds[3],0);

        let xAxis = new Line(xStart, xEnd);
        let yAxis = new Line(yStart, yEnd);

        let xPts : PointVector[] = xAxis.render(ui.getCanvas().width);
        let yPts : PointVector[] = yAxis.render(ui.getCanvas().width);


        for(let i = 0; i < xPts.length; i++){
            xPts[i].scaleVector(scaleVector);
            xPts[i].add(translationVector);
            let px = this.pixelLocation(xPts[i], ui.getCanvas().width, ui.getCanvas().height);
            this.setPixel(px, this.xAxisColor, img);
        }

        for(let i = 0; i < yPts.length; i++){
            yPts[i].scaleVector(scaleVector);
            yPts[i].add(translationVector);
            let px = this.pixelLocation(yPts[i], ui.getCanvas().width, ui.getCanvas().height);
            this.setPixel(px, this.yAxisColor, img);
        }

    }

    renderGeometry(img : ImageData, g: Geometry[], ui:  UI, cam : Camera2D){
        let pointsToWrite: PointVector[] = new Array<PointVector>();
        let scaleVector = cam.getScaleVector();
        let bounds : number[] = cam.getBounds(ui);
        let traslationVector = cam.getRenderTranslation(ui);

        for(let index = 0; index < g.length; index++){
            let tempPts: PointVector[] = g[index].render(1000.0);
            
            for(let i = 0; i< tempPts.length; i++){
                
                if(tempPts[i].inBounds(bounds)){
                    tempPts[i].scaleVector(scaleVector);
                    let point : PointVector = tempPts[i].addUtil(traslationVector);
                    
                    if(g[index].isSelected()){
                        point.setSelected(true);
                    }

                    pointsToWrite.push(point);
                }
            }
        }

        for(let i = 0; i < pointsToWrite.length; i++){

            let px = this.pixelLocation(pointsToWrite[i], ui.getCanvas().width, ui.getCanvas().height);
            
            if(pointsToWrite[i].isSelected()){
                this.setPixel(px, this.selectedColor, img);
            }else{
                this.setPixelToBlack(px, img);
            }
            
        }
    }

    setPixelToBlack(loc:number, imageData : ImageData) : void{
        imageData.data[loc  ] = 0;
        imageData.data[loc+1] = 0;
        imageData.data[loc+2] = 0;
        imageData.data[loc+3] = 255;
    }

    setPixel(loc: number, col: ColorRGBA, imageData : ImageData){
        imageData.data[loc  ] = col.r();
        imageData.data[loc+1] = col.g();
        imageData.data[loc+2] = col.b();
        imageData.data[loc+3] = col.a();
    }

    // function to return the index of the pixel you are looking to set
    // by default the array is 1D - this is our 2D to 1D translation
    pixelLocation(pt: PointVector, w: number, h:number): number{
        return (pt.getY() * w * 4) + (pt.getX() * 4);
    }

}

class ColorRGBA{

    red:  number;
    green : number;
    blue : number;
    alpha : number;

    constructor(_r, _g, _b, _a){
        this.red = _r;
        this.green = _g;
        this.blue = _b;
        this.alpha = _a;
    }

    r(){
        return this.red;
    }

    g(){
        return this.green;
    }
    
    b(){
        return this.blue;
    }

    a(){
        return this.alpha;
    }

}