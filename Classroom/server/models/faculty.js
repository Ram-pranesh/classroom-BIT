// models/FacultyClass.js
import mongoose from "mongoose";

const facultyClassSchema = new mongoose.Schema(
  {
    ClassName: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      enum: ['Odd', 'Even'],
      required: true,
    },
    year: {
      type: String,
      enum: ['2019-20', '2020-21', '2021-22', '2022-23', '2024-25', '2025-26', '2026-27'],
      required: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "facultyclasses" }
);

const FacultyClassModel = mongoose.model("FacultyClass", facultyClassSchema);

export default FacultyClassModel;
