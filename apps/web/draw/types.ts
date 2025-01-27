export type ShapesType = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number
} | {
    type : "pencil",
    startX : number,
    startY : number,
    endX : number,
    endY : number
} | {
    type : "text",
    content : string,
    startX : number,
    startY : number
}

export type selectedToolType = "rect" | "circle" | "pencil" | "text"