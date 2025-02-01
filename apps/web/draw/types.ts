export type ShapesType = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number,
    style : string
} | {
    type: "circle",
    centerX: number,
    centerY: number,
    radius: number,
    style : string
} | {
    type : "pencil",
    startX : number,
    startY : number,
    endX : number,
    endY : number,
    style : string
} | {
    type : "text",
    content : string,
    startX : number,
    startY : number,
    style : string
}

export type selectedToolType = "rect" | "circle" | "pencil" | "text" | "eraser"

// export type styleType = {
//     fillColor ? : string,
//     strokeColor : string
// }


export type bgColor = "white" | "blue" | "green" | "yellow" | "red" | "black"

