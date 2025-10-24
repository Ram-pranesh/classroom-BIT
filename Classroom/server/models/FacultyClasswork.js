import mongoose from "mongoose";

const classworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileMimeType: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    classType: {
      type: String,
      enum: ["class", "faculty"],
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    gridFsFileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, collection: "classworks" }
);

const FacultyClassworkModel = mongoose.model("FacultyClasswork", classworkSchema);

export default FacultyClassworkModel;