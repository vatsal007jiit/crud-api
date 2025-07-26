import { model, Schema } from "mongoose";
import bcrypt from "bcrypt"

const authSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Invalid Email'],
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

authSchema.pre('save', async function(next){
    const count = await model('Auth').countDocuments({email: this.email})
    if(count > 0)
        throw next( new Error("Email already Exists"))
    next();
})

authSchema.pre('save', async function(next){
    const encryptedPwd = await bcrypt.hash(this.password.toString(), 12)
    this.password = encryptedPwd
    next()
})

const authModel = model('Auth', authSchema)
export default authModel