import ClassModel from "../models/Class.js";
import ClassworkModel from "../models/Classwork.js";
import StudentsModel from "../models/students.js";
import path from "path";
import fs from "fs";



const CreateClass = async (req, res) => {
  try {
    const { ClassName, semester, year } = req.body;
    const createdBy = req.user?.email; // Assuming auth middleware sets req.user
    if (!ClassName || !semester || !year || !createdBy) {
      return res.status(400).json({
        success: false,
        message: "Class name, semester, year, and creator email are required",
      });
    }

    const newClass = await ClassModel.create({
      ClassName,
      semester,
      year,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass,
    });
  } catch (error) {
    console.error("createClass error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClasses = async (req, res) => {
  try {
    const userEmail = req.user?.email;
    const userRole = req.user?.role;

    if (!userEmail) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User email not found",
      });
    }

    let getclass;
    if (
      userRole === "admin" ||
      userRole === "superadmin" ||
      userRole === "super admin" // <-- Accept both formats
    ) {
      getclass = await ClassModel.find({});
    } else {
      getclass = await ClassModel.find({ createdBy: userEmail });
    }

    if (!getclass || getclass.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No classes found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Classes displayed successfully",
      getclass,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await ClassModel.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Class data retrieved successfully",
      classData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getStudentsClasses = async (req, res) => {
  try {
    const { email } = req.params;
    const studentRecords = await StudentsModel.find({ email });

    if (!studentRecords.length) {
      return res.status(404).json({
        success: false,
        message: "No classes found for this student",
      });
    }
    const classIds = studentRecords.map((student) => student.ClassId);

    if (!classIds.length) {
      return res.status(404).json({
        success: false,
        message: "No class IDs found for this student",
      });
    }

    const studentClasses = await ClassModel.find({ _id: { $in: classIds } });
    return res.status(200).json({
      success: true,
      message: "Student's classes retrieved successfully",
      classes: studentClasses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const archiveClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToArchive = await ClassModel.findById(id);
    if (!classToArchive) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    classToArchive.isArchived = true;
    await classToArchive.save();

    return res.status(200).json({
      success: true,
      message: "Class archived successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const unarchiveClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToUnarchive = await ClassModel.findById(id);
    if (!classToUnarchive) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    classToUnarchive.isArchived = false;
    await classToUnarchive.save();

    return res.status(200).json({
      success: true,
      message: "Class unarchived successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getArchivedClasses = async (req, res) => {
  try {
    const archivedClasses = await ClassModel.find({ isArchived: true });
    if (!archivedClasses || archivedClasses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No archived classes found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Archived classes retrieved successfully",
      archivedClasses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const editClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { ClassName } = req.body;

    if (!ClassName) {
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      id,
      { ClassName },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const classToDelete = await ClassModel.findById(id);
    if (!classToDelete) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    await ClassModel.findByIdAndDelete(id);

    await StudentsModel.updateMany({ ClassId: id }, { $pull: { ClassId: id } });

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const uploadClasswork = async (req, res) => {
  try {
    const { title, classId } = req.body;
    if (!req.files || req.files.length === 0 || !title || !classId) {
      console.log("Missing required fields:", {
        files: !!req.files,
        title: !!title,
        classId: !!classId,
      });
      return res.status(400).json({
        success: false,
        message: "Title, at least one file, and classId are required",
      });
    }

    const classworks = [];
    for (const file of req.files) {
      const classwork = {
        title,
        classId,
        filename: file.filename, // Multer-generated filename (e.g., 1234567890.pdf)
        originalFilename: file.originalname, // Original filename (e.g., my-document.pdf)
        fileData: file.buffer, // Store the file data as a Buffer
        contentType: file.mimetype, // Store the MIME type (e.g., application/pdf)
        uploadDate: new Date(),
      };
      const newClasswork = await ClassworkModel.create(classwork);
      classworks.push(newClasswork);
    }

    return res.status(201).json({
      success: true,
      message: "Classwork uploaded successfully",
      classworks,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClassworks = async (req, res) => {
  try {
    const { id } = req.params; // classId
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Class ID is required",
      });
    }

    const classworks = await ClassworkModel.find({ classId: id }).sort({ uploadDate: -1 });
    if (!classworks || classworks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No classworks found for this class",
        classworks: [],
      });
    }
    

    console.log(`Retrieved ${classworks.length} classworks for classId ${id}`);
    return res.status(200).json({
      success: true,
      message: "Classworks retrieved successfully",
      classworks,
    });
  } catch (error) {
    console.error("Error retrieving classworks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteClasswork = async (req, res) => {
  try {
    const { id } = req.params;
    const classwork = await ClassworkModel.findByIdAndDelete(id);
    if (!classwork) {
      return res.status(404).json({
        success: false,
        message: "Classwork not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Classwork deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editClasswork = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const updatedClasswork = await ClassworkModel.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );

    if (!updatedClasswork) {
      return res.status(404).json({
        success: false,
        message: "Classwork not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Classwork updated successfully",
      classwork: updatedClasswork,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const downloadClasswork = async (req, res) => {
  try {
    const { id } = req.params;
    const classwork = await ClassworkModel.findById(id);

    if (!classwork) {
      return res.status(404).json({
        success: false,
        message: "Classwork not found",
      });
    }
    res.set({
      'Content-Type': classwork.contentType,
      'Content-Disposition': `attachment; filename="${classwork.originalFilename}"`,
    });

    // const filePath = path.join(path.resolve(), "public/images", classwork.filename);
    // if (!fs.existsSync(filePath)) {
    //   return res.status(404).json({ success: false, message: "File not found" });
    // }
    res.send(classwork.fileData);
    // Use originalFilename if available, otherwise fall back to filename
    const downloadName = classwork.originalFilename || classwork.filename;
    return res.download(filePath, downloadName);
  } catch (error) {
    console.error("Error sending file:", error);
    return res.status(500).json({
      success: false,
      message: "Error downloading file",
    });
  }
};
  

export {
  CreateClass,
  getClasses,
  getClassById,
  getStudentsClasses,
  archiveClass,
  editClass,
  deleteClass,
  unarchiveClass,
  getArchivedClasses,
  uploadClasswork,
  getClassworks,
  deleteClasswork,
  editClasswork,
  downloadClasswork,
};
