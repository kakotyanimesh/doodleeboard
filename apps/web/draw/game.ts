export class Game {
    private canvas : HTMLCanvasElement
    private ctx : CanvasRenderingContext2D
    private startingX = 0
    private startingY = 0
    private isDraw : boolean = false
    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!


    }


    mouseDown = (e : MouseEvent ) => {
        this.isDraw = true
        this.startingX = e.clientX
        this.startingY = e.clientY
    }

    mouseUp = (e : MouseEvent ) => {
        this.isDraw = false
    }
    
    mouseMove = (e : MouseEvent ) => {
        if(this.isDraw){
            
        }
    }


    mouseHandlers () {
        this.canvas.addEventListener("mousedown", this.mouseDown)
        this.canvas.addEventListener("mousemove", this.mouseMove)
        this.canvas.addEventListener("mouseup", this.mouseUp)
    }
}