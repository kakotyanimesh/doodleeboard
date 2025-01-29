import { Shapes, Sheet } from "lucide-react"
import { bgColor, selectedToolType, ShapesType } from "./types"
import { getShapesfromBackend } from "./http"
import { text } from "stream/consumers"

export class GameClass{
    private canvas : HTMLCanvasElement
    
    private ctx : CanvasRenderingContext2D
    private roomId : string
    private selectedTool : selectedToolType = "rect"
    private selecteColor : bgColor = "transparent"
    private existingShapes : ShapesType[] = []
    private startX : number = 0
    private startY : number = 0
    private isDraw : boolean = false
    private textArea : HTMLTextAreaElement | null = null
    private textAreaRef : {current : HTMLTextAreaElement | null} = {current : null}
    
    private ws : WebSocket
    constructor(canvas : HTMLCanvasElement, roomId : string, ws : WebSocket){
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        
        this.roomId = roomId
        this.ws = ws

        this.handleOnMessageHandler()

    }


    setTool(tool : selectedToolType){
        this.selectedTool = tool
    }


    setBgColor(color : bgColor){
        this.selecteColor = color
    }
    handleOnMessageHandler(){
        this.ws.onmessage = (event : MessageEvent) => {
            try {
                const data = JSON.parse(event.data)


                if(data.type === "draw"){
                    this.existingShapes.push(JSON.parse(data.message))

                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    this.drawALLShapes()
                }
            } catch (error) {
                console.log(`error at handle on message g ${error}`);
                
            }
        }
    }

    private drawShape (shape : ShapesType)  {
        this.ctx.strokeStyle = "white"
        if(shape.type === "rect"){
            // this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
            shape.style === "transparent" 
                ?
                    this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
                : 
                    this.ctx.fillStyle = `${shape.style}`
                    this.ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
        } else if (shape.type === "circle"){
            this.ctx.beginPath()
            this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2)
            // this.ctx.stroke()
            shape.style === "transparent"
                ?
                    this.ctx.stroke()
                :
                    this.ctx.fillStyle = `${shape.style}`
                    this.ctx.fill()
        } else if (shape.type === "pencil"){
            this.ctx.beginPath()
            this.ctx.moveTo(shape.startX, shape.startY)
            this.ctx.lineTo(shape.endX, shape.endY)
            this.ctx.stroke()
        } else if (shape.type === "text"){
            this.ctx.fillStyle = "white"
            this.ctx.font = "24px Arial",
            this.ctx.fillText(shape.content, shape.startX, shape.startY)
        }
    }



    private drawALLShapes(){
        this.existingShapes.forEach((s) => {
            this.drawShape(s)
        })
    }

    mouseDown = (e : MouseEvent) => {
        
        this.startX = e.clientX
        this.startY = e.clientY

        if(this.selectedTool === "text"){
            this.createTextArea(this.startX, this.startY)
        } else {
            this.isDraw = true
        }
    }


    mouseMove = (e : MouseEvent) => {
        if(this.isDraw){
            const currentX = e.clientX - this.canvas.offsetLeft
            const currentY = e.clientY - this.canvas.offsetTop
            const width = currentX - this.startX
            const height = currentY - this.startY


            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.drawALLShapes()
            this.selecteColor === "transparent" ? this.ctx.strokeStyle === "white" : this.ctx.fillStyle = `${this.selecteColor}`
            // this.ctx.strokeStyle = "white" 
            // this.ctx.fillStyle = "white"
            if(this.selectedTool === "rect"){
                

                // this.ctx.fillRect(this.startX, this.startY, width, height) //==> use when we want to fill the color of the rect 
                this.selecteColor === "transparent"  
                    ? 
                        this.ctx.strokeRect(this.startX, this.startY, width, height) 
                    : 
                        this.ctx.fillRect(this.startX, this.startY, width, height) 
            } else if (this.selectedTool === "circle"){
                const radius = Math.sqrt(
                    Math.pow(width, 2) + 
                    Math.pow(height, 2)
                )

                this.ctx.beginPath()
                this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2)
                // this.ctx.fill()  //=> to fill the color in circle 
                // this.ctx.stroke()
                this.selecteColor === "transparent" 
                    ? 
                        this.ctx.stroke()
                    :
                        this.ctx.fill()
            } else if (this.selectedTool === "pencil"){
                this.ctx.beginPath()
                this.ctx.moveTo(this.startX, this.startY)
                this.ctx.lineTo(e.clientX, e.clientY)
                this.ctx.stroke()
            }
        } 
    }

    mouseUp = (e : MouseEvent) => {
        this.isDraw = false

        const currentX = e.clientX - this.canvas.offsetLeft
        const currentY = e.clientY - this.canvas.offsetTop

        const width = currentX - this.startX
        const height = currentY - this.startY

        const radius = Math.sqrt(
            Math.pow(width, 2) + 
            Math.pow(height, 2)
        )

        let shapesObject : ShapesType |  null = null

        if(this.selectedTool === "rect"){
            shapesObject = {
                type : "rect",
                x : this.startX,
                y : this.startY,
                width,
                height,
                style : this.selecteColor === "transparent" ? "transparent" : `${this.selecteColor}`
            }
        } else if (this.selectedTool === "circle"){
            shapesObject = {
                type : "circle",
                centerX : this.startX,
                centerY : this.startY,
                radius,
                style : this.selecteColor === "transparent" ? "transparent" : `${this.selecteColor}`
            }
        } else if ( this.selectedTool === "pencil"){
            shapesObject = {
                type : "pencil",
                startX : this.startX,
                startY : this.startY,
                endX : e.clientX,
                endY : e.clientY
            }
        }

        if(!shapesObject){
            return
        }

        this.existingShapes.push(shapesObject)

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawALLShapes()


        this.ws.send(JSON.stringify({
            type : "draw",
            roomId : Number(this.roomId),
            message : JSON.stringify(shapesObject)
        }))

    }


    async drawShapesFrombackend(){
        try {
            const data = await getShapesfromBackend(this.roomId)
            // console.log(data.response);
            

            this.existingShapes = data.response.map((Shape : any) => {
                return JSON.parse(Shape.shapes)
            })

            this.drawALLShapes()

        } catch (error) {
            console.log(`data from backend error : ${error}`);
            
        }
    }

    mouseHandlers () {
        this.canvas.addEventListener("mousedown", this.mouseDown)
        this.canvas.addEventListener("mouseup", this.mouseUp)
        this.canvas.addEventListener("mousemove", this.mouseMove)
    }

    clearEvents(){
        this.canvas.removeEventListener("mousedown", this.mouseDown)
        this.canvas.removeEventListener("mouseup", this.mouseUp)
        this.canvas.removeEventListener("mousemove", this.mouseMove)
    }


    private createTextArea(x : number, y : number){
        // if(this.textArea){
        //     document.body.removeChild(this.textArea)
        // }

        
        this.textArea = document.createElement("textarea")
        this.textArea.style.border = "none"
        this.textArea.style.outline = "none"
        this.textArea.style.color = "white"
        this.textArea.style.resize = "none"
        this.textArea.style.position = "absolute"
        this.textArea.style.top = `${y}px`
        this.textArea.style.left = `${x}px`
    
        document.body.appendChild(this.textArea)

        this.textAreaRef.current = this.textArea

        setTimeout(() => {
            if(this.textAreaRef.current){
                this.textAreaRef.current.focus()
            }
        }, 0);

        this.textArea.addEventListener("blur", () => {
            const text = this.textArea?.value

            document.body.removeChild(this.textArea!)
            this.textAreaRef.current = null

            if(text){
                const textObject : ShapesType = {
                    type : "text",
                    content : text,
                    startX : x,
                    startY : y
                }

                this.existingShapes.push(textObject)
                
                this.ws.send(JSON.stringify({
                    type : "draw",
                    roomId : Number(this.roomId),
                    message : JSON.stringify(textObject)
                }))

                this.drawALLShapes()
            }

        })


    }
}