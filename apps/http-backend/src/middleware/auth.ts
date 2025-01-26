import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const accessToken = req.cookies.accessToken

    if(!accessToken){
        res.status(401).json({
            msg : "no access token provided "
        })
        return
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN  as string)  as JwtPayload

        const userId = decoded.userId
        req.userId = userId

        next()



        
    } catch (error) {
        res.status(401).json({
            msg : 'unverified token '
        })
    }
}