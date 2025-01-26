import { Router } from "express";
import { signup, singin } from "../controller/user.controller";

const userRouter : Router = Router()

userRouter.post("/signup", signup)
userRouter.post("/signin", singin)


export default userRouter