"use client"

import { useEffect, useRef, useState } from "react"
import { Game } from "../../draw/game"
import { matchesGlob } from "path"


export type toolType = "circle" | "rect"
 
export default function MainCanvas({roomId, ws} : {
    roomId : string,
    ws : WebSocket
}) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    
    

    useEffect(() => {
      const canvas = canvasRef.current
      
      

      if(canvas){
        

        
      }
      
      
    }, [canvasRef])
    
    // if(!ws){
    //     return <div>
    //         connnectting .....
    //     </div>
    // }

    return (
        <div>
            <div className="fixed bg-yellow-300">
                <button onClick={() => alert("circle")}>circle</button>
                <button onClick={() => alert("rect")}>rect</button>

            </div>
            <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
            
        </div>
    )
}