import express from "express";
import {
  CreateFacultyClass,
  getFacultyClasses,
  getAllFacultyClasses,
  getFacultyClassById,
  editFacultyClass,
  deleteFacultyClass,
  archiveFacultyClass,
  unarchiveFacultyClass,
  getArchivedFacultyClasses,
  getClassworks,
  uploadClasswork,
  deleteClasswork,
  downloadClasswork,
} from "../controllers/faculty.js";
import upload from "../middleware/Multer.js";
import authMiddleware from "../middleware/Authmiddleware.js";

const FacultyClassRoutes = express.Router();

FacultyClassRoutes.post("/createclass", authMiddleware, CreateFacultyClass);
FacultyClassRoutes.get("/getclass", authMiddleware, getFacultyClasses);
FacultyClassRoutes.get("/getallclasses", authMiddleware, getAllFacultyClasses);
FacultyClassRoutes.get("/getclass/:id", getFacultyClassById);
FacultyClassRoutes.post("/updateclass/:id", authMiddleware, editFacultyClass);
FacultyClassRoutes.post("/deleteclass/:id", authMiddleware, deleteFacultyClass);
FacultyClassRoutes.post("/archiveclass/:id", authMiddleware, archiveFacultyClass);
FacultyClassRoutes.post("/unarchiveclass/:id", authMiddleware, unarchiveFacultyClass);
FacultyClassRoutes.get("/getarchived", authMiddleware, getArchivedFacultyClasses);
FacultyClassRoutes.get("/classwork/:id", authMiddleware, getClassworks);
FacultyClassRoutes.post("/classwork/upload", authMiddleware, upload.array("files"), uploadClasswork);
FacultyClassRoutes.post("/classwork/delete/:classworkId", authMiddleware, deleteClasswork);
FacultyClassRoutes.get("/classwork/download/:classworkId", authMiddleware, downloadClasswork);

export default FacultyClassRoutes;