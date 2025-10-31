import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  ClassName:  { 
     type: String,
     required: true
     },
  semester: { 
    type: String, 
    enum: ['Odd', 'Even'], 
    required: true 
  }, 
  year: {
    type: String,
     required: true
     }, 
  createdBy: {
     type: String,
      required: true
     }, 
}, { timestamps: true });

const ClassModel = mongoose.model('Class', classSchema);
export default ClassModel;

const getStudentsClasses = async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Fetching classes for student email:", email); // Add logging
    const studentRecords = await StudentsModel.find({ email });

    if (!studentRecords.length) {
      console.log("No student records found for:", email); // Add logging
      return res.status(404).json({
        success: false,
        message: "No classes found for this student",
      });
    }

    const classes = studentRecords.map(record => record.ClassName);
    return res.json({
      success: true,
      classes,
    });
  } catch (error) {
    console.error("Error fetching classes:", error); // Add logging
    return res.status(500).json({
      success: false,
      message: "Error fetching classes",
    });
  }
};