"use client"

import { useEffect, useRef, useState } from "react"
import { Game } from "../../draw/game"

export type toolType = "circle" | "rect"
 
export default function MainCanvas({roomId} : {
    roomId : string
}) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [selectedTool, setselectedTool] = useState<toolType >("circle")
    const [game, setGame] = useState<Game>()

    useEffect(() => {
      game?.setTOOL(selectedTool)
    }, [selectedTool, game])
    

    useEffect(() => {
      const canvas = canvasRef.current

      const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTgwOWNhNS04ZjZmLTRiNDQtYTRmZS05MTdhNTcyOWJhYzUiLCJpYXQiOjE3Mzc4OTg2NjQsImV4cCI6MTczNzkzNDY2NH0.6YaUKCA78JOkw77QnjjkVk-Sppye3mS_NQK3D6nB-rM`)


      ws.onopen = () => {
        ws.send(JSON.stringify({
            type : "join",
            roomId : roomId
        }))

      }

      

      if(canvas){
        const g = new Game(canvas, roomId, ws)
        setGame(g)
      }
    
      
    }, [canvasRef])
    
    // if(!ws){
    //     return <div>
    //         connnectting .....
    //     </div>
    // }

    return (
        <div className="absolute">
            <div className="fixed bg-yellow-300">
                <button onClick={() => setselectedTool("circle")}>circle</button>
                <button onClick={() => setselectedTool("rect")}>rect</button>

            </div>
            <canvas width={window.innerWidth} height={window.innerHeight} ref={canvasRef}></canvas>
            
        </div>
    )
}