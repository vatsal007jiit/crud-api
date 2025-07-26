import { NextFunction, Request, Response } from "express";
import { catchError } from "../lib/err";
import jwt, { JwtPayload } from "jsonwebtoken"

interface payloadInterface {
    name: string
    email: string
}

export interface userInterface extends Request{
    user: payloadInterface
}


export const authMiddleware = (req: userInterface, res: Response, next:NextFunction) =>{
    try {
        const {authorization} = req.headers
        if(!authorization)
            return res.status(401).json({message: "Unauthorised User"})
        const [type, token] = authorization.split(" ")
        if(type !== 'Bearer')
           return res.status(401).json({message: "Invalid Request"})
        
        const user = jwt.verify(process.env.JWT_SECRET!, token) as JwtPayload
        req.user = {
            name: user.name,
            email: user.email
        }
        next()
    } 
    catch (error) {
        catchError(error, res)
    }
}