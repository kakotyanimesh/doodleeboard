"use client"

import { Circle,RectangleHorizontal, PencilLine, Baseline } from 'lucide-react';
import { useEffect, useRef, useState } from "react"
import { Game } from "../../draw/game"
import { matchesGlob } from "path"
import { selectedToolType } from "../../draw/types"
import { GameLogic } from "../../draw/gamelogic"


export type toolType = "circle" | "rect"
 
export default function MainCanvas({roomId, ws} : {
    roomId : string,
    ws : WebSocket
}) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const gameRef = useRef<GameLogic |null>(null)
    const [selectedtool, setselectedtool] = useState<selectedToolType>("rect")
    // const [windowWidth, setWindowWidth] = useState({width : window.innerWidth, height : window.innerHeight})
    
    useEffect(() => {
      
    
      gameRef.current?.setTool(selectedtool)
    }, [selectedtool])

    // console.log(gameRef.current?.getX);
    
    useEffect(() => {
      const canvas = canvasRef.current

      if(canvas && ws){
        const g = new GameLogic(canvas, roomId, ws)
        gameRef.current = g

        g.mouseHandlers()

        g.drawExistingShapes()

        // g.handlewebsoketmessage()
        
        return () => {
          g.clearCanvas()

          // ws.send(JSON.stringify({
          //   type : "leave",
          //   roomId : roomId
          // }))
        }
      }
    }, [ws, roomId])
    
   
    
    // useEffect(() => {

    //   const handleResize = () => {
    //     setWindowWidth({width : window.innerWidth, height : window.innerHeight})
    //   }
    //   window.addEventListener("resize", handleResize)
    
    //   return () => {
    //     window.removeEventListener("resize", handleResize)
    //   }
    // }, [windowWidth])
    


    return (
        <div className="">
            <div className="fixed  right-10">
              <div className="flex flex-row gap-6 py-2 px-3">
                <button className={`px-3 py-2 rounded-md ${selectedtool === "circle" ? "bg-blue-600 ": "bg-gray-200"}`} onClick={() => setselectedtool("circle")}><Circle/></button>
                <button className={`px-3 py-2 rounded-md ${selectedtool === "rect" ? "bg-blue-600" : "bg-gray-200"}`} onClick={() => setselectedtool("rect")}><RectangleHorizontal/></button>
                <button className={`px-3 py-2 rounded-md ${selectedtool === "pencil" ? "bg-blue-600" : "bg-gray-200"}`} onClick={() => setselectedtool("pencil")}><PencilLine/></button>
                <button className={`px-3 py-2 rounded-md ${selectedtool === "text" ? "bg-blue-600" : "bg-gray-200"}`} onClick={() => setselectedtool("text")}><Baseline/></button>

              </div>
            </div>
            
            <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
            
        </div>
    )
}