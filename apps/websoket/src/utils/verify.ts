import jwt, { JwtPayload } from "jsonwebtoken"

export const verifyToken = (url : string) : string | null => {
    const queryParams = new URLSearchParams(url.split("?")[1])

    const token = queryParams.get("token")

    if(!token){
        return null
    }


    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN as string) as JwtPayload

    if(typeof decoded !== "object" && !decoded){
        return null
    }

    const userId = decoded.userId 

    return userId
}