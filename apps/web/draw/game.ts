import { off } from "process"
import { toolType } from "../app/components/mainacanvas"
import { getShapesfromBackend } from "./http"
import { ShapesType } from "./types"

export class Game{
    private canvas : HTMLCanvasElement
    private ctx : CanvasRenderingContext2D
    private existingShapes : ShapesType[]
    private roomId : string
    private initialX = 0
    private initialY = 0
    private draw : boolean
    private selectedTool : toolType = "circle"

    soket : WebSocket
    constructor (canvas : HTMLCanvasElement, roomId : string, soket : WebSocket)  {
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")!
        this.existingShapes = []
        this.roomId = roomId
        this.soket = soket
        this.draw = false
        this.init()
        this.initMouseHandler()
        this.initSoketHandler()
    }

    async init () {
        this.existingShapes = await getShapesfromBackend(this.roomId)
        this.clearCanvas()

    }

    destroy(){
        this.canvas.removeEventListener("mousedown", this.mouseDown)
        this.canvas.removeEventListener("mouseup", this.mouseUp)
        this.canvas.removeEventListener("mousemove", this.mouseMove)
    }

    initSoketHandler() {
        this.soket.onmessage = (event) => {
            const parsedMsg = JSON.parse(event.data)

            if(parsedMsg.type === 'draw'){
                const shapes = parsedMsg.shapes

                this.existingShapes.push(shapes)
                this.clearCanvas()
            }
        }
    }


    clearCanvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)


        if(this.existingShapes){
            this.existingShapes.map((shape) => {
                if(shape.type === "rect"){
                    this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
                } else if(shape.type === "circle"){
                    this.ctx.beginPath()
                    this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2)
                    this.ctx.stroke()
                }
            })
        }
    }

    setTOOL (tool : toolType) {
        this.selectedTool = tool
    }
    mouseDown = (e : MouseEvent) => {
        this.draw = true
        this.initialX = e.clientX
        this.initialY = e.clientY
    }
 
    mouseUp = (e : MouseEvent) => {
        this.draw = false

        const width = e.clientX - this.initialX
        const height = e.clientY - this.initialY
        const radius = Math.abs(Math.max(width, height) / 2 )

        const selectedTool = this.selectedTool
        let shape : ShapesType | null = null

        if(selectedTool === "rect"){
            shape = {
                type : "rect",
                x : e.clientX,
                y : e.clientY,
                width,
                height
            }
        } else if(selectedTool === "circle"){
            shape = {
                type : "circle",
                centerX  : e.clientX + radius,
                centerY  : e.clientY + radius,
                radius
            }
        }

        if(!shape){
            return
        }
        // this.existingShapes.push(shape)


        this.soket.send(JSON.stringify({
            type : "draw",
            roomId : this.roomId,
            message : this.existingShapes
        }))

        
    }

    mouseMove = (e : MouseEvent) => {
        if(this.draw){
            const width = e.clientX - this.initialX
            const height = e.clientY - this.initialY

            const radius = Math.abs(Math.max(width, height) / 2)
            // this.clearCanvas

            const toolselected = this.selectedTool

            if(toolselected === "circle"){
                const centerX = e.clientX + radius
                const centerY = e.clientY + radius
                this.ctx.beginPath()
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
                this.ctx.stroke()
                this.ctx.closePath()
            } else if(toolselected === "rect"){
                this.ctx.strokeRect(e.clientX, e.clientY, width, height)
            }
        }
    }


    initMouseHandler(){
        this.canvas.addEventListener("mousedown", this.mouseDown)
        this.canvas.addEventListener("mousemove", this.mouseUp)
        this.canvas.addEventListener("mouseup", this.mouseUp)
    }
}