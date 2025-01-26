import { Router } from "express";
import { createRoom, getShapes } from "../controller/room.controller";
import { authMiddleware } from "../middleware/auth";

const roomRouter : Router = Router()


roomRouter.post('/createRoom',authMiddleware, createRoom)
roomRouter.get("/shapes/:roomId", getShapes)
// we have to check if that user belongs to that room or not 

export default roomRouter