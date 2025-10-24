import mongoose from "mongoose";

const attendanceSchema=new mongoose.Schema({
    user:{
        type:String,
      
    },
    status:{
      type:String,
      enum:['present','absent'],
      // default:'absent',
      required:true  
    }, 
    classId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Class', 
        required: true
       },
       hour:{
        type:String
    }
    
},{timestamps:true})

const AttendanceModel=mongoose.model("Attendance",attendanceSchema)
export default AttendanceModel