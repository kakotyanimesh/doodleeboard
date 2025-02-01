export type toolType = "rect" | "circle" | "pencil" | "text"


export interface shapeStyles {
    fillColor ?: string
    fillStroke : string,
    lineWidth : number
}


export interface ShapesType {
    tool : toolType,
    startX : number,
    startY : number,
    endX ?: number,
    endY ?:number,
    style : shapeStyles
}