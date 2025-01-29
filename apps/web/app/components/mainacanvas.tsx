"use client"

import { Circle,RectangleHorizontal, PencilLine, Baseline } from 'lucide-react';
import { useEffect, useRef, useState } from "react"
import { Game } from "../../draw/game"
import { matchesGlob } from "path"
import { bgColor, selectedToolType } from "../../draw/types"
import { GameLogic } from "../../draw/gamelogic"
import { GameClass } from '../../draw/gamelogicV2';


export type toolType = "circle" | "rect"
 
export default function MainCanvas({roomId, ws} : {
    roomId : string,
    ws : WebSocket
}) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const gameRef = useRef<GameClass | null>(null)
    const [selectedtool, setselectedtool] = useState<selectedToolType>("rect")
    const [bgcolor, setBgcolor] = useState<bgColor>("transparent")    

    useEffect(() => {
      
    gameRef.current?.setTool(selectedtool)
      
    }, [selectedtool])

    useEffect(() => {
      gameRef.current?.setBgColor(bgcolor)
    }, [bgcolor])
    

    useEffect(() => {
      const canvas = canvasRef.current

      if(canvas){
        const g = new GameClass(canvas, roomId, ws)
        gameRef.current =g

        g.mouseHandlers()
        g.drawShapesFrombackend()

        return () => {
          g.clearEvents()
        }

      }
    
      
    }, [canvasRef])
    
    useEffect(() => {
      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }
      };
    
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    


    return (
      <div className="h-screen w-screen relative overflow-hidden">
      
      <div className="absolute top-2 z-10 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-row gap-2 bg-[#232329] p-3 rounded-lg">
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "circle" ? "bg-blue-600" : "bg-gray-200 hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("circle")}
          >
            <Circle />
          </button>
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "rect" ? "bg-blue-600" : "bg-gray-200 hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("rect")}
          >
            <RectangleHorizontal />
          </button>
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "pencil" ? "bg-blue-600" : "bg-gray-200 hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("pencil")}
          >
            <PencilLine />
          </button>
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "text" ? "bg-blue-600" : "bg-gray-200 hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("text")}
          >
            <Baseline />
          </button>
        </div>
      </div>
      
      <div className='bg-[#232329] top-20 left-5 py-3 px-4 rounded-md  z-20 absolute gap-2.5 flex flex-col'>
        <button 
        onClick={() => setBgcolor("blue")}
            className={`${bgcolor === "blue" ? "bg-blue-600" : "bg-gray-200"} rounded-md px-2 `}
          >blue
        </button>
        <button 
        onClick={() => setBgcolor("red")}
            className={`${bgcolor === "red" ? "bg-red-600" : "bg-gray-200"} rounded-md px-2 `}
          >red
        </button>
        <button 
        onClick={() => setBgcolor("yellow")}
            className={`${bgcolor === "yellow"  ? "bg-yellow-600" : "bg-gray-200"} rounded-md px-2`}
          >yellow
        </button>
      </div>
      
      <canvas
        className="absolute top-0 left-0 w-full h-full bg-black"
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
    )
}




// const canvasRef = useRef<HTMLCanvasElement | null>(null)
//     const gameRef = useRef<GameLogic |null>(null)
//     const [selectedtool, setselectedtool] = useState<selectedToolType>("rect")
//     // const [windowWidth, setWindowWidth] = useState({width : window.innerWidth, height : window.innerHeight})
    
//     useEffect(() => {
      
    
//       gameRef.current?.setTool(selectedtool)
//     }, [selectedtool])

//     // console.log(gameRef.current?.getX);
    
//     useEffect(() => {
//       const canvas = canvasRef.current

//       if(canvas && ws){
//         const g = new GameLogic(canvas, roomId, ws)
//         gameRef.current = g

//         g.mouseHandlers()

//         g.drawExistingShapes()

//         // g.handlewebsoketmessage()
        
//         return () => {
//           g.clearCanvas()

//           // ws.send(JSON.stringify({
//           //   type : "leave",
//           //   roomId : roomId
//           // }))
//         }
//       }
//     }, [ws, roomId])
    
   
    
//     // useEffect(() => {

//     //   const handleResize = () => {
//     //     setWindowWidth({width : window.innerWidth, height : window.innerHeight})
//     //   }
//     //   window.addEventListener("resize", handleResize)
    
//     //   return () => {
//     //     window.removeEventListener("resize", handleResize)
//     //   }
//     // }, [windowWidth])