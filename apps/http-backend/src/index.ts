import cookieParser from "cookie-parser"
import express from "express"
import userRouter from "./routes/user.routes"
import roomRouter from "./routes/room.routes"
require("dotenv").config({path : "../../.env"})
import cors from "cors"


const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/user", userRouter)
app.use("/api/v1/room", roomRouter)

app.listen(4000, () => {
    console.log(`the app is running at http:localhost:4000`);
    
})