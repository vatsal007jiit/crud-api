import { Request, Response } from "express";
import { catchError } from "../lib/err";
import bcrypt from "bcrypt"
import authModel from "../model/auth.model";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) =>{
    try {
        const payload = req.body
        await authModel.create(payload)
        res.json({message: "Signup Successful"})
    } 
    catch (error) {
        catchError(error, res)
    }
}

export const login = async (req: Request, res: Response) =>{
    try {
        const {email, password} = req.body
        const user = await authModel.findOne({email})
        if(!user)
            return res.status(404).json({message: "User Not Found , Please Signup"})

        const isLogin = bcrypt.compareSync(password, user.password)
        if(!isLogin)
            return res.status(401).json({message: "Invalid Credentials- Login failed"})

        const payload = {
            name: user.name,
            email: user.email 
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: '7d'})
        res.json({
            message: "Login Successful",
            token
        })
    } 
    catch (error) {
        catchError(error, res)
    }
}