import { configDotenv } from "dotenv";
configDotenv()

import mongoose from "mongoose";

mongoose.connect(process.env.db as string)
.then(() => console.log("Connected to DB"))
.catch((err) => console.log("Error connection to DB", err))

import express from "express";
import cors from "cors"
import productRouter from "./routes/product.router"
import { login, signup } from "./controller/auth.controller";
const app = express()
app.listen(process.env.port || 8080)

app.use(cors({
    origin: process.env.CLIENT,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/product', productRouter)
app.post('/login', login)
app.post('/signup', signup)
app.get('/', (req, res) => {
    res.send("Server is running")
})