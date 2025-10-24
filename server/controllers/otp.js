import AttendanceModel from "../models/attendance.js";
import OTPModel from "../models/otp.js";

const generateOTP=async(req,res)=>{
    try {
        const { otp,classId,hour } = req.body; 
        if (!otp || !classId ||!hour) {
            return res.status(400).json({ 
                success: false, 
                message: "OTP is required" 
            });
          }
          await OTPModel.deleteMany({classId});
          const newOtp = await OTPModel.create({ otp,classId,hour, otpExpiresAt: new Date(Date.now() + 20000) });
            res.status(201).json({
                 message: "OTP generated successfully",
                  otp: newOtp 
                });

    } catch (error) {
        console.error(error);
         res.status(500).json({
             success: false, 
             message: "Internal server error" 
            });
    }
}
const submitOTP = async (req, res) => {
    try {
 
      const { otp, user, classId } = req.body;
      if (!otp || !user || !classId) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
      }
  
      const currentOtp = await OTPModel.findOne({ classId });    
      if (!currentOtp || new Date() > currentOtp.otpExpiresAt) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP. Please check your class',
        });
      }
  
      if (currentOtp.classId !== classId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid OTP for this class',
        });
      }
  
      const today = new Date().toISOString().split('T')[0];
      const hour = currentOtp.hour;      
    
      const existingAttendance = await AttendanceModel.findOne({
        user,
        classId,
        hour,
        createdAt: {
          $gte: new Date(today),
          $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
        },
      });
   
  
      if (existingAttendance) {
        return res.status(403).json({
          success: false,
          message: `Attendance for ${hour} is already marked for today!`,
        });
      }
  
      if (currentOtp.otp === otp) {
        
        const attendance = await AttendanceModel.create({
          user,
          status: 'present',
          classId,
          hour,
        });
        res.status(201).json({
          message: 'Attendance recorded',
          status: attendance.status,
          hour: attendance.hour,
        });
      } else {
        return res.status(402).json({
          success: false,
          message: 'Incorrect OTP. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error in submitOTP:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  

export {generateOTP,submitOTP}