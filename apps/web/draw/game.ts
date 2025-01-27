import { Arya } from "next/font/google"
import { selectedShpeType, ShapesType } from "./types"

export class Game {
    private canvas : HTMLCanvasElement
    private ctx : CanvasRenderingContext2D
    private startingX : number = 0
    private startingY : number = 0
    private isDraw : boolean = false
    private existingShapes : ShapesType[] = []
    private selectedShape : selectedShpeType = "rect" // decalring it as rect when user clicks in frontend we can change it 


    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        
    }


    setShapeType(type : selectedShpeType){
        this.selectedShape = type
        // from frontend we are sending seleceted shape type and here we are adding it 
    }

// shapesType and selectedShpae type is different 
    private drawShape (shape : ShapesType){
        this.ctx.beginPath()

        if(shape.type === "rect"){
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type === "circle"){
            this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2)
            this.ctx.stroke()
        }
    }

    private drawAllShapes (){
        this.existingShapes.forEach((shape) => {
            this.drawShape(shape)
        })

        // itterating over each and every shapes and draw it using the drawShape function
    }

    


    mouseDown = (e : MouseEvent ) => {
        this.isDraw = true
        this.startingX = e.clientX - this.canvas.offsetLeft
        this.startingY = e.clientY - this.canvas.offsetTop
        // this.mouseHandlers()
    }


    mouseMove = (e : MouseEvent) => {
        if(this.isDraw){
            const currentX = e.clientX - this.canvas.offsetLeft
            const currentY = e.clientY - this.canvas.offsetTop
            const width = currentX - this.startingX
            const height = currentY - this.startingY
            const radius = Math.sqrt(
                Math.pow(currentX - this.startingX , 2) + 
                Math.pow(currentY - this.startingY , 2)
            )

            

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // clearing canvas 
            this.drawAllShapes()
            // redraw all the existing shapes inside the for time being in memory array
            
            if(this.selectedShape === "rect"){
               
                this.ctx.strokeRect(this.startingX, this.startingY, width, height)
            } else if (this.selectedShape === "circle"){
                this.ctx.beginPath()
                this.ctx.arc(this.startingX, this.startingY, radius, 0, Math.PI * 2)
                this.ctx.stroke()
            }
            
        }
    }

    mouseUp = (e : MouseEvent) => {
        this.isDraw = false

        const currentX = e.clientX - this.canvas.offsetLeft
        const currentY = e.clientY - this.canvas.offsetTop

        const width = currentX - this.startingX
        const height = currentY - this.startingY
        const radius = Math.sqrt(
            Math.pow(currentX - this.startingX, 2) +
            Math.pow(currentY - this.startingY, 2)
        )
        
        

        if(this.selectedShape === "rect"){
            this.existingShapes.push({
                type : "rect",
                x : this.startingX,
                y : this.startingY,
                width,
                height
            })
        } else if (this.selectedShape === "circle"){
            this.existingShapes.push({
                type : "circle",
                centerX : this.startingX,
                centerY : this.startingY,
                radius : radius
            })
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawAllShapes()
    }


    mouseHandlers (){
        this.canvas.addEventListener("mousedown", this.mouseDown)
        this.canvas.addEventListener("mousemove", this.mouseMove)
        this.canvas.addEventListener("mouseup", this.mouseUp)
    }


    cleanUp (){
        this.canvas.removeEventListener("mousedown", this.mouseDown)
        this.canvas.removeEventListener("mousemove", this.mouseMove)
        this.canvas.removeEventListener("mouseup", this.mouseUp)
    }
}
