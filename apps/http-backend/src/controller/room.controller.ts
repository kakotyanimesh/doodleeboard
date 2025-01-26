import { roomObject } from "@repo/common/types";
import prisma from "@repo/db";
import { Request, Response } from "express";

export const createRoom = async (req : Request, res : Response) => {
    const parsedObj = roomObject.safeParse(req.body)

    if(!parsedObj.success){
        res.status(400).json({
            msg : `zod error ${JSON.stringify(parsedObj.error.errors)}`
        })
        return
    }

    try {
        const adminId = req.userId
        if(!adminId){
            return
        }
        const room = await prisma.room.create({
            data : {
                slug : parsedObj.data.slug,
                adminId : adminId
            }
        })

        res.status(200).json({
            msg : "room created",
            id : room.id
        })
    } catch (error) {
        res.status(500).json({
            msg : `server error at creating room ${process.env.NODE_ENV === "developement" ? error : undefined}`
        })
    }
}


export const getShapes = async(req : Request, res : Response) => {
    try {
        const roomId = req.params.roomId

        const response = await prisma.drawings.findMany({
            where : {
                roomId : Number(roomId)
            }
        })

        res.status(200).json({
            response 
        })
    } catch (error) {
        res.status(500).json({
            msg : `server error at getting shapes ${process.env.NODE_ENV === "developement" ? error : undefined}`
        })
    }
}