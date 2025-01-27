"use client"

import { useEffect, useRef, useState } from "react"
import { Game } from "../../draw/game"
import { matchesGlob } from "path"
import { selectedToolType } from "../../draw/types"


export type toolType = "circle" | "rect"
 
export default function MainCanvas({roomId, ws} : {
    roomId : string,
    ws : WebSocket
}) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const gameRef = useRef<Game | null>(null)
    const [selectedTool, setselectedTool] = useState<toolType>("rect")


    useEffect(() => {
      gameRef.current?.setTool(selectedTool)
    
      
      
    }, [selectedTool])

    useEffect(() => {
      const canvas = canvasRef.current

      if(canvas){
        const g = new Game(canvas)
        gameRef.current = g

        g.mouseHandlers()

        return () =>{
            g.cleanUp()
        }
      }
      
    }, [canvasRef])
    
    
   
    

    return (
        <div>
            <div className="fixed bg-yellow-300 flex flex-rw gap-7">
                <button onClick={() => setselectedTool("circle")}>circle</button>
                <button onClick={() => setselectedTool("rect")}>rect</button>

            </div>
            <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
            
        </div>
    )
}