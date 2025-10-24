// controllers/FacultyClass.js
import FacultyClassModel from "../models/faculty.js";
import FacultyClassworkModel from "../models/FacultyClasswork.js";
import path from "path";
import fs from "fs";
import { getGridFSBucket } from "../utils/gridfs.js"; // Ensure correct import
import { Readable } from "stream";

const CreateFacultyClass = async (req, res) => {
  try {
    const { ClassName, semester, year } = req.body;
    const userEmail = req.body.createdBy;
    if (!ClassName || !semester || !year || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Class name, semester, year, and creator email are required",
      });
    }

    const validSemesters = ['Odd', 'Even'];
    const validYears = ['2019-20', '2020-21', '2021-22', '2022-23', '2024-25', '2025-26', '2026-27'];
    if (!validSemesters.includes(semester)) {
      return res.status(400).json({
        success: false,
        message: "Semester must be 'Odd' or 'Even'",
      });
    }
    if (!validYears.includes(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be one of: " + validYears.join(', '),
      });
    }

    const NewClass = await FacultyClassModel.create({ ClassName, semester, year, createdBy: userEmail });
    return res.status(201).json({
      success: true,
      message: "Faculty class created successfully",
      class: NewClass,
    });
  } catch (error) {
    console.error("CreateFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFacultyClasses = async (req, res) => {
  try {
    const { email } = req.query;
    console.log('getClass request:', { user: req.user, email });
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No user authenticated',
      });
    }
    if (!['admin', 'super admin', 'faculty'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'User is not authorized',
      });
    }
    if (!email || email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Email mismatch or missing',
      });
    }

    const classes = await FacultyClassModel.find({ createdBy: email });
    console.log('getClass response:', { classes: classes.length });
    return res.status(200).json({
      success: true,
      message: 'Classes retrieved successfully',
      getclass: classes,
    });
  } catch (error) {
    console.error('getClass error:', {
      message: error.message,
      stack: error.stack,
      user: req.user,
      query: req.query,
    });
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getAllFacultyClasses = async (req, res) => {
  try {
    const classes = await FacultyClassModel.find({ isArchived: false }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All faculty classes retrieved successfully",
      getclass: classes,
    });
  } catch (error) {
    console.error("getAllFacultyClasses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getFacultyClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await FacultyClassModel.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Faculty class data retrieved successfully",
      classData,
    });
  } catch (error) {
    console.error("getFacultyClassById error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { ClassName, semester, year } = req.body;

    if (!ClassName || !semester || !year) {
      return res.status(400).json({
        success: false,
        message: "Class name, semester, and year are required",
      });
    }

    const validSemesters = ['Odd', 'Even'];
    const validYears = ['2019-20', '2020-21', '2021-22', '2022-23', '2024-25', '2025-26', '2026-27'];
    if (!validSemesters.includes(semester)) {
      return res.status(400).json({
        success: false,
        message: "Semester must be 'Odd' or 'Even'",
      });
    }
    if (!validYears.includes(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be one of: " + validYears.join(', '),
      });
    }

    const updatedClass = await FacultyClassModel.findByIdAndUpdate(
      id,
      { ClassName, semester, year },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("editFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToDelete = await FacultyClassModel.findByIdAndDelete(id);
    if (!classToDelete) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    // Optionally delete associated classworks
    await ClassworkModel.deleteMany({ classId: id, classType: 'faculty' });

    return res.status(200).json({
      success: true,
      message: "Faculty class deleted successfully",
    });
  } catch (error) {
    console.error("deleteFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const archiveFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToArchive = await FacultyClassModel.findById(id);
    if (!classToArchive) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    classToArchive.isArchived = true;
    await classToArchive.save();

    return res.status(200).json({
      success: true,
      message: "Faculty class archived successfully",
    });
  } catch (error) {
    console.error("archiveFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const unarchiveFacultyClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToUnarchive = await FacultyClassModel.findById(id);
    if (!classToUnarchive) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    classToUnarchive.isArchived = false;
    await classToUnarchive.save();

    return res.status(200).json({
      success: true,
      message: "Faculty class unarchived successfully",
    });
  } catch (error) {
    console.error("unarchiveFacultyClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getArchivedFacultyClasses = async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const archivedClasses = await FacultyClassModel.find({ createdBy: userEmail, isArchived: true }).sort({ createdAt: -1 });
    if (!archivedClasses || archivedClasses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No archived faculty classes found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Archived faculty classes retrieved successfully",
      archivedClasses,
    });
  } catch (error) {
    console.error("getArchivedFacultyClasses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClassworks = async (req, res) => {
  try {
    const { id } = req.params;
    const classExists = await FacultyClassModel.findById(id);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    const classworks = await FacultyClassworkModel.find({ classId: id, classType: 'faculty' }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Classworks retrieved successfully",
      classworks,
    });
  } catch (error) {
    console.error("getClassworks error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const uploadClasswork = async (req, res) => {
  try {
    const { classId, title } = req.body;
    // console.log("Upload request received:", { classId, title, files: req.files?.map(f => f.originalname) });
    
    if (!classId || !title || !req.files || req.files.length === 0) {
      console.log("Missing required fields:", { classId, title, files: req.files });
      return res.status(400).json({
        success: false,
        message: "Class ID, title, and at least one file are required",
      });
    }

    const classExists = await FacultyClassModel.findById(classId);
    if (!classExists) {
      console.log("Class not found for ID:", classId);
      return res.status(404).json({
        success: false,
        message: "Faculty class not found",
      });
    }

    const createdBy = req.user?.email;
    if (!createdBy) {
      console.log("User email not found in req.user");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User email not found",
      });
    }

    const gridfsBucket = getGridFSBucket();
    const classworks = [];

    for (const file of req.files) {
      console.log("Processing file:", file.originalname);
      const readableStream = Readable.from(file.buffer);
      const uploadStream = gridfsBucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: { classId, createdBy },
      });

      readableStream.pipe(uploadStream);

      const gridFsFileId = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
      });

      const classwork = await FacultyClassworkModel.create({
        title,
        originalFilename: file.originalname,
        fileSize: file.size,
        fileMimeType: file.mimetype,
        classId,
        classType: "faculty",
        createdBy,
        gridFsFileId,
      });
      classworks.push(classwork);
    }

    return res.status(201).json({
      success: true,
      message: "Classworks uploaded successfully",
      classworks,
    });
  } catch (error) {
    console.error("uploadClasswork error:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      files: req.files?.map(f => f.originalname),
    });
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const deleteClasswork = async (req, res) => {
  try {
    const { classworkId } = req.params;
    const classwork = await FacultyClassworkModel.findById(classworkId);
    if (!classwork || classwork.classType !== "faculty") {
      return res.status(404).json({
        success: false,
        message: "Classwork not found",
      });
    }

    const classData = await FacultyClassModel.findById(classwork.classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User email not found",
      });
    }

    if (classData.createdBy !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete classworks in classes you created",
      });
    }

    // Delete file from GridFS
    const gridfsBucket = getGridFSBucket();
    await gridfsBucket.delete(classwork.gridFsFileId);

    // Delete classwork document
    await FacultyClassworkModel.findByIdAndDelete(classworkId);

    return res.status(200).json({
      success: true,
      message: "Classwork deleted successfully",
    });
  } catch (error) {
    console.error("deleteClasswork error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const downloadClasswork = async (req, res) => {
  try {
    const { classworkId } = req.params;
    const classwork = await FacultyClassworkModel.findById(classworkId);
    if (!classwork || classwork.classType !== "faculty") {
      return res.status(404).json({
        success: false,
        message: "Classwork not found",
      });
    }

    const gridfsBucket = getGridFSBucket();
    const downloadStream = gridfsBucket.openDownloadStream(classwork.gridFsFileId);

    res.set("Content-Type", classwork.fileMimeType);
    res.set("Content-Disposition", `attachment; filename="${classwork.originalFilename}"`);

    downloadStream.pipe(res);

    downloadStream.on("error", (error) => {
      console.error("Download stream error:", error);
      res.status(500).json({
        success: false,
        message: "Error streaming file",
      });
    });
  } catch (error) {
    console.error("downloadClasswork error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export {
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
};