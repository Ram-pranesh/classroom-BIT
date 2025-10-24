import mongoose from "mongoose";

const StudentsSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true,
    },
    ClassId:{
        type:String,required: true
    }
},{timestamps:true})

const StudentsModel = mongoose.model('Students',StudentsSchema)

export default StudentsModel