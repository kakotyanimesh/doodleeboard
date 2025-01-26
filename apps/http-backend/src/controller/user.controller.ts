import { Request, Response } from "express";
import { signinObject, signupObject } from "@repo/common/types"
import prisma from "@repo/db";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async(req : Request, res : Response ) => {
    const parsedObj =signupObject.safeParse(req.body)

    if(!parsedObj.success){
        res.status(400).json({
            msg : `zod error ${JSON.stringify(parsedObj.error.errors)}`
        })
        return
    }

    const {name, password, email}= parsedObj.data
    try {
        const hasedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data : {
                name,
                password : hasedPassword,
                email
            }, select : {
                id : true
            }
        })

        res.status(201).json({
            msg : "user created ",
            id : user.id
        })
    } catch (error) {
        if(error instanceof Error && (error as any).code === "P2002"){
            res.status(409).json({
                msg : "user already exits with same email"
            })
            return
        }

        res.status(500).json({
            msg : `server error at signup ${process.env.NODE_ENV === "developement" ? error : undefined}`
        })
    }
}


export const singin = async (req : Request, res : Response ) => {
    const parsedObj = signinObject.safeParse(req.body)

    if(!parsedObj.success){
        res.status(400).json({
            msg : `zod error : ${JSON.stringify(parsedObj.error.errors)}`
        })
        return
    }

    try {
        const user = await prisma.user.findUnique({
            where : {
                email : parsedObj.data.email
            }
        })

        if(!user){
            res.status(404).json({
                msg : "user doesnot exits "
            })
            return
        }

        const comaparePassword = await bcrypt.compare(parsedObj.data.password, user.password)

        if(!comaparePassword){
            res.status(404).json({
                msg : "password doesnot matched"
            })
            return
        }

        const accessToken = jwt.sign({userId : user.id}, process.env.ACCESS_TOKEN as string, {expiresIn : "10h"})
        const refreshToken = jwt.sign({userId : user.id}, process.env.REFRESH_TOKEN as string, {expiresIn : "7d"})

        const options = {
            httpOnly : true,
            secure : true
        }

        res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            msg : `user logged in `
        })
    } catch (error) {
        res.status(500).json({
            msg : `server error at signin ${process.env.NODE_ENV === "developement" ? error : undefined}`
        })
    }
}