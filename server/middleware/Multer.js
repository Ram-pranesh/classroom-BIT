import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure Uploads/Classworks directory exists
const uploadDir = 'Uploads/Classworks/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|ppt|pptx|doc|docx|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype.toLowerCase());

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, PPT, PPTX, DOC, DOCX, JPG, JPEG, and PNG files are allowed"));
  },
});

export default upload;