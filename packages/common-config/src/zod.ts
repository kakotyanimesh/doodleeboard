
import { z } from  "zod"

export const signupObject = z.object({
    name : z.string().max(20, {message : "total 20 chracter is allowed"}),
    email : z.string().email({message : "provide a valid email"}),
    password : z.string().max(25, {message : "only 25character is allowed"})
})


export const signinObject = z.object({
    email : z.string().email({message : "provide a valid email address"}),
    password :  z.string().max(25, {message : "only 25character is allowed"})
})


export const roomObject = z.object({
    slug : z.string().max(20, {message : "only 20 character is allowed"})
})
