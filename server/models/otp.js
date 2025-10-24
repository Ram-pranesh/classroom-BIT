import mongoose from "mongoose";

const otpSchema= new mongoose.Schema({
    otp:{
        type:String,
        required:true,
    },
    otpExpiresAt:{
        type:Date,
        required:true
    },
    classId:{
        type:String
    },
    hour:{
        type:String
    }
})

const OTPModel=mongoose.model("OTP",otpSchema)
export default OTPModel