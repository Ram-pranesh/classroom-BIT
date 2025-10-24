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