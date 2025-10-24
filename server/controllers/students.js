import StudentsModel from "../models/students.js"

const addstudents=async(req,res)=>{
    try {
        const {email,classId }=req.body
        // console.log("Request body:", req.body);
         if (!email || !classId) {
            return res.status(400).json({
                success: false,
                message: "Register number and classId are required",
            });
        }
        const existStudent=await StudentsModel.findOne({email,ClassId: classId })
        if(existStudent){
            return res.status(409).json({
                success:"false",
                message:"Stduent Already Exist"
            })
        }
        const NewStudents = new StudentsModel({email,ClassId: classId })
        await NewStudents.save()
        return res.status(201).json({
            success:true,
            message:"Stduents added successfully",
            user:NewStudents
         })

    } catch (error) {
        return res.status(500).json({
        success:false,
        message:"Internal server occured"
    })
    }
}

const getStudents =async(req,res)=>{
try {
    const classId = req.query.classId || req.params.classId;
    // console.log("Requested classId:", classId);
    if (!classId) {
        return res.status(400).json({
          success: false,
          message: "classId is required",
        });
      }

    const studentsData = await StudentsModel.find({ ClassId: classId }).select("email -_id");
    // console.log("Fetched Students:", studentsData);
    if (!studentsData ||studentsData.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No students found for this class",
        });
      }

    //   const formattedStudents = studentsData.map(student => {
    //     const name = student.email.split(".")[0]; 
    //     return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    //         // student.email
    // });
    const formattedStudents = studentsData.map(student => {
        if (!student.email) {
        //   console.log(" Missing email field in student record:", student); // Debug
          return "Unknown";  // Fallback value
        }
        const name = student.email.split(".")[0]; 
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      });


    return res.status(200).json({
        success:true,
        message:"Students data retrieved",
        // students: formattedStudents,
        students: studentsData.map(student=>student.email)
    })
} catch (error) {
    console.log(error)
    return res.status(500).json({
        success:false,
        message:"Internal error occured"
    })
}
}

const delteteStudents=async(req,res)=>{
    try {
        const {email, classId}=req.body
        // console.log("Received DELETE request with:", { email, classId });
        if (!email || !classId) {
            return res.status(400).json({
                success: false,
                message: "Email and classId are required",
            });
        }
        const studentExists = await StudentsModel.findOne({ email, ClassId: classId });
        // console.log("Student found:", studentExists);
        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        await StudentsModel.findOneAndDelete({ email, ClassId: classId });
       return res.status(200).json({
        success:true,
        message:"Deleted successfully"
       })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server occured"
        })
    }

}

export {addstudents,getStudents,delteteStudents}