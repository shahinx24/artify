import express from "express"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js";

const app = express()
app.use(express.json())

connectDB()
app.use("/users", userRoutes)

app.get("/", (req,res)=>{
    res.send("Welcome to test face")
})

app.listen(3000, ()=>{
    console.log("server is live in http://localhost:3000")
})
