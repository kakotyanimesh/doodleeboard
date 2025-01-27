"use client"

import { useEffect, useState } from "react";
import MainCanvas from "./mainacanvas";

export default function ProxyCanvas({roomId} : {roomId : string}) {
    const [soket, setSoket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTgwOWNhNS04ZjZmLTRiNDQtYTRmZS05MTdhNTcyOWJhYzUiLCJpYXQiOjE3MzgwMDMyNjEsImV4cCI6MTczODAzOTI2MX0.jmBulc-yVC1KIGs2a1ptGtZrq_ZBWmDXJMalGFrnDSU
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