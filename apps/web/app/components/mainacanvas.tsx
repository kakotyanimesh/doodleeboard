"use client" 

import { Circle,RectangleHorizontal, PencilLine, Baseline, Eraser } from 'lucide-react';
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
    const [bgcolor, setBgcolor] = useState<bgColor>("black")    

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
              selectedtool === "circle" ? "bg-[#403e6a]" : "null hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("circle")}
          >
            <Circle />
          </button>
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "rect" ? "bg-[#403e6a]" : "null hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("rect")}
          >
            <RectangleHorizontal />
          </button>
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "pencil" ? "bg-[#403e6a]" : "null hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("pencil")}
          >
            <PencilLine />
          </button>
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "text" ? "bg-[#403e6a]" : "null hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("text")}
          >
            <Baseline />
          </button>
          <button
            className={`p-1 rounded-md cursor-pointer ${
              selectedtool === "eraser" ? "bg-[#403e6a]" : "null hover:bg-slate-400"
            }`}
            onClick={() => setselectedtool("eraser")}
          >
            <Eraser  />
          </button>
        </div>
      </div>
      
      <div className='bg-[#232329] top-20 left-5 py-3 px-4 rounded-md  z-20 absolute gap-2.5 flex flex-row'>
        <h1>stroke</h1>
        <button 
        onClick={() => setBgcolor("blue")}
            // className={`${bgcolor === "blue" ? "bg-red-200" : ""} rounded-md px-2 `}
            className={`${bgcolor === "blue" ? "outline-2 outline-[#b6b6c3]" : "outline-0"} bg-blue-600 rounded-md`}
          >
            <div className='w-7 h-5'>
              
            </div>
        </button>
        <button 
        onClick={() => setBgcolor("red")}
            className={`${bgcolor === "red" ? "outline-2 outline-[#b6b6c3]" : "null"} bg-red-600 rounded-md `}
          >
            <div className='w-7 h-5'>
              
            </div>
        </button>
        <button 
        onClick={() => setBgcolor("yellow")}
            className={`${bgcolor === "yellow"  ? "outline-2 outline-[#b6b6c3]" : "null"} bg-yellow-400 rounded-md`}
          >
            <div className='w-7 h-5'>

            </div>
        </button>
      </div>
      
      <canvas
        className="absolute top-0 left-0 w-full h-full bg-[#111011]"
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