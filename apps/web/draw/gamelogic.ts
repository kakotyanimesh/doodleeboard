
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
    private textArea : HTMLTextAreaElement | null = null
    private textAreaRef : {current : HTMLTextAreaElement | null} = {current : null}
    // private fontsStyle 
 
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
            try {
                const data = JSON.parse(event.data)
    
                // console.log(data);
                
                if(data.type === "draw"){
                    const newShape = JSON.parse(data.message)
                    // console.log(newShape + "new shaape");
                    
    
                    this.existingShape.push(newShape)
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    this.drawAllShapes()
                }
            } catch (error) {
                console.log(`error while parsing websoket message : ${error}`);
                
            }
        }
    }

    setTool(tool : selectedToolType){
        this.selectedTool = tool
    }


    // font function

    
      
 

    
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
        } 
        else if(shape.type === "text"){
            // const myFont = new FontFace("myFont", 'url(public/fonts/fontOne.woff2')

            // myFont.load().then((font) => {
            //     document.fonts.add(font)
            // })
            this.ctx.font = "20px Courier New"
            this.ctx.fillText(shape.content, shape.startX, shape.startY)
        }
    }



    private drawAllShapes(){
        this.existingShape.forEach((shape) => {
            this.drawShape(shape)
        })
    }


    private createTextArea(x : number, y : number) {
        if(this.textArea){
            document.body.removeChild(this.textArea)
        }

        const canvasRect = this.canvas.getBoundingClientRect()

        const pageX = x + canvasRect.left
        const pageY = y + canvasRect.top
        
        console.log(x);
        console.log(y);

        

        this.textArea = document.createElement("textarea")
        this.textArea.style.position = "absolute"
        this.textArea.style.top = `${pageY}px`
        this.textArea.style.left = `${pageX}px`
        this.textArea.style.resize = "none"
        this.textArea.style.outline = "none"
        this.textArea.style.zIndex = "1000"
        this.textArea.style.fontSize = "26px";
        this.textArea.style.color = "black";
        


        document.body.appendChild(this.textArea)

        this.textAreaRef.current = this.textArea

        setTimeout(() => {
            if(this.textAreaRef.current){
                this.textAreaRef.current.focus()
            }
        }, 0);
        // this.textArea.focus()
        


        // event listner for user input

        this.textArea.addEventListener("blur", () => {
            const text = this.textArea?.value

            document.body.removeChild(this.textArea!)

            this.textArea = null
            this.textAreaRef.current = null

            if(text){
                const shape : ShapesType = {
                    type : "text",
                    content : text,
                    startX : x,
                    startY : y
                }

                this.existingShape.push(shape)

                this.ws.send(JSON.stringify({
                    type : "draw",
                    roomId : Number(this.roomId),
                    message : JSON.stringify(shape)
                }))

                this.drawAllShapes()
            }
        })


        this.textArea.addEventListener("keydown", (e) => {
            if(e.key === "Tab"){
                e.preventDefault()
                this.textArea?.blur()
            }
        })
    }

    mouseDown = (e : MouseEvent) => {
        
        this.startx = e.clientX - this.canvas.offsetLeft
        this.starty = e.clientY - this.canvas.offsetTop

        if(this.selectedTool === "text"){
            this.createTextArea(this.startx, this.starty)
        } else {
            this.isDraw = true
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