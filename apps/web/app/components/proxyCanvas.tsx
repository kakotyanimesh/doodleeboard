"use client"

import { useEffect, useState } from "react";
import MainCanvas from "./mainacanvas";

export default function ProxyCanvas({roomId} : {roomId : string}) {
    const [soket, setSoket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzZTcwNDIyZi01MzIzLTQ4ODktYWIxNS01YjYwYTIxOGE5YjUiLCJpYXQiOjE3MzgzMTI5OTMsImV4cCI6MTczODM0ODk5M30.Rn6EIvdMq-3jyRHe-uFxcSILnW7Kl3csDv78wHmX-MY
`)

        ws.onopen = (e) => {
            setSoket(ws)
            ws.send(JSON.stringify({
                type : "join",
                roomId : Number(roomId)
            }))
        }

        return () => {
            ws.close()
        }
    
    }, [])
    

    if(!soket){
        return <div>
            connnectting ......
        </div>
    }

    return (
        <MainCanvas roomId={roomId} ws={soket}/>
    )
}