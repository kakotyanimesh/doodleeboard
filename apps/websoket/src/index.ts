import { WebSocketServer } from "ws";
import { verifyToken } from "./utils/verify";
import { User } from "./utils/types";
import prisma from "@repo/db"

require("dotenv").config({path : "../../.env"})
const wss = new WebSocketServer({port : 8080})


let usersArray : User[] = []

wss.on("connection", (ws, req) => {
    try {
        const url = req.url
        
        if(!url){
            return
        }

        const userId = verifyToken(url)

        if(!userId){
            return
        }


        usersArray.push({
            ws : ws,
            room : [],
            userId : userId
        })


        ws.on("message", async(msg) => {
            const parsedMsg = JSON.parse(msg as unknown as string)

            if(parsedMsg.type === "join"){
                const user = usersArray.find(x => x.ws === ws)

                user?.room.push(parsedMsg.roomId)
            }

            if(parsedMsg.type === "leave"){
                const user = usersArray.find(x => x.ws === ws)

                if(!user){
                    return
                }

                user.room = user.room.filter(x => x !== parsedMsg.roomId)
            }


            if(parsedMsg.type === "draw"){
                const {roomId, message } = parsedMsg

                try {
                    await prisma.drawings.create({
                        data : {
                            roomId : Number(roomId),
                            shapes : message,
                            creatorId : userId
                        }
                    })

                    usersArray.forEach((user) => {
                        if(user.room.includes(roomId) && user.ws !== ws){
                            user.ws.send(JSON.stringify({
                                type : "draw",
                                message : message
                            }))
                        }
                    })
                } catch (error) {
                    ws.send(JSON.stringify({
                        type : "error",
                        error : error
                    }))
                }
            }
        })

    } catch (error) {
        ws.send(JSON.stringify({
            type : "error",
            error : error
        }))
    }
})