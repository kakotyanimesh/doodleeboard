import { Shapes } from "lucide-react"
import { toolType } from "../app/components/mainacanvas"
import { getShapesfromBackend } from "./http"
import { selectedToolType, ShapesType } from "./types"

export class GameLogic{

    private canvas : HTMLCanvasElement
    private ctx : CanvasRenderingContext2D
    private existingShape : ShapesType[] = []
    private selectedTool : selectedToolType = "rect"
    private startx : number = 0
    private starty : number = 0
    private isDraw : boolean = false

    private roomId : string
    private ws : WebSocket
    constructor(canvas : HTMLCanvasElement, roomId : string, ws : WebSocket){
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!

        this.ws = ws
        this.roomId = roomId

        this.handlewebsoketmessage()
    }



    handlewebsoketmessage (){
        this.ws.onmessage = (event : MessageEvent) => {
            const data = JSON.parse(event.data)

            // console.log(data);
            
            if(data.type === "draw"){
                const newShape = JSON.parse(data.message)
                // console.log(newShape + "new shaape");
                

                this.existingShape.push(newShape)
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.drawAllShapes()
            }
        }
    }

    setTool(tool : selectedToolType){
        this.selectedTool = tool
    }

    private drawShape(shape: ShapesType){
        if(shape.type === "rect"){
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type === "circle"){
            this.ctx.beginPath()
            this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2)
            this.ctx.stroke()
        } else if (shape.type === "pencil"){
            this.ctx.beginPath()
            this.ctx.moveTo(shape.startX, shape.startY)
            this.ctx.lineTo(shape.endX, shape.endY)
            this.ctx.stroke()
        } else if(shape.type === "text"){
            this.ctx.font = "16px Arial"
            this.ctx.fillText(shape.content, shape.startX, shape.startY)
        }
    }



    private drawAllShapes(){
        this.existingShape.forEach((shape) => {
            this.drawShape(shape)
        })
    }


    mouseDown = (e : MouseEvent) => {
        this.isDraw = true
        this.startx = e.clientX - this.canvas.offsetLeft
        this.starty = e.clientY - this.canvas.offsetTop

        if(this.selectedTool === "text"){
            const input = document.createElement("input")
            input.type = "text"
            input.style.top = `${this.starty}px`
            input.style.left = `${this.startx}px`
            input.style.backgroundColor = "black"


            document.body.appendChild(input)

            input.focus()

            input.addEventListener("blur", () => {
                const text = input.value
                document.body.removeChild(input)

                if(text){
                    const shape : ShapesType = {
                        type : "text",
                        content : text,
                        startX : this.startx,
                        startY : this.starty
                    }
                    this.existingShape.push(shape)

                    this.ws.send(JSON.stringify({
                        type : "draw",
                        roomId : Number(this.roomId),
                        message : JSON.stringify(shape)
                    }))
                }
                
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.drawAllShapes()
            })

            

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    input.blur(); // Trigger blur to complete input
                }
            });
        }
    }

    mouseMove = (e : MouseEvent) => {
        if(this.isDraw){
            const currentx = e.clientX - this.canvas.offsetLeft
            const currentY = e.clientY - this.canvas.offsetTop


            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.drawAllShapes()
            if(this.selectedTool === "circle"){
                const radius = Math.sqrt(
                    Math.pow(currentx - this.startx,2)+ 
                    Math.pow(currentY - this.starty, 2)
                )

                this.ctx.beginPath()
                this.ctx.arc(this.startx, this.starty, radius, 0, Math.PI *2 )
                this.ctx.stroke()

            } else if(this.selectedTool === "rect"){
                const width = currentx - this.startx
                const height = currentY - this.starty

                this.ctx.strokeRect(this.startx, this.starty, width, height)

            } else if (this.selectedTool === "pencil"){
                this.ctx.beginPath();
                this.ctx.moveTo(this.startx, this.starty)
                this.ctx.lineTo(e.clientX, e.clientY)
                this.ctx.stroke()
            }

        }
    }


    mouseUp = (e : MouseEvent) => {
        this.isDraw = false

        const currentX = e.clientX - this.canvas.offsetLeft
        const currentY = e.clientY - this.canvas.offsetTop

        let newShapesArray : ShapesType | null = null

        if(this.selectedTool === "rect"){
            const width = currentX - this.startx
            const height = currentY - this.starty
            newShapesArray = {
                type : "rect",
                x : this.startx,
                y : this.starty,
                width,
                height
            }
        } else if (this.selectedTool === "circle"){
            const radius = Math.sqrt(
                Math.pow(currentX - this.startx, 2) + 
                Math.pow(currentY - this.starty, 2)
            )

            newShapesArray = {
                type : "circle",
                centerX : this.startx,
                centerY : this.starty,
                radius
            }
        } else if (this.selectedTool === "pencil"){
            newShapesArray = {
                type : "pencil",
                startX : this.startx,
                startY : this.starty,
                endX : e.clientX,
                endY : e.clientY    
            }
        }

        if(!newShapesArray){
            return
        }

        this.existingShape.push(newShapesArray)
        

        this.ws.send(JSON.stringify({
            type : "draw",
            roomId : Number(this.roomId),
            message : JSON.stringify(newShapesArray)
        }))

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawAllShapes()
    }


    async drawExistingShapes(){
        try {
            const data = await getShapesfromBackend(this.roomId)
            // console.log(data.response);
            

            this.existingShape = data.response.map((shape : any) => {
                // console.log(shape.shapes);
                
                return JSON.parse(shape.shapes)
            })



            this.drawAllShapes()

        } catch (error) {
            console.log(`error at getting shapes : ${error}`);
            
        }
    }

    mouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDown)
        this.canvas.addEventListener("mousemove", this.mouseMove)
        this.canvas.addEventListener("mouseup", this.mouseUp)
    }

    clearCanvas(){
        this.canvas.removeEventListener("mousedown", this.mouseDown)
        this.canvas.removeEventListener("mousemove", this.mouseMove)
        this.canvas.removeEventListener("mouseup", this.mouseUp)
    }

}