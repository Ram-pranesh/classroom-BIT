import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Achievement from '../models/Achievement.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store all files in the public/images folder
    cb(null, path.join(__dirname, '..', 'public', 'images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });

// POST /api/achievements/filter - MUST BE BEFORE THE GENERIC POST ROUTE
router.post('/filter', async (req, res) => {
  try {
    console.log('Filter route hit with:', req.body);
    const { emails, category } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'Valid email array is required' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Map category names to database field names (MUST MATCH YOUR SCHEMA EXACTLY)
    const categoryMap = {
      'Paper Presentations': 'paperPresentations',  // Changed from paperpresentations
      'Publications': 'publications',
      'Patents': 'patents',
      'Entrepreneurship': 'entrepreneurship',
      'Placement': 'placement',
      'Project Details': 'projectDetails',  // Changed from projectdetails
      'Competitions': 'competitions',
      'Internship': 'internship',
      'Online Course': 'onlineCourse',  // Changed from onlinecourse
      'Product Development': 'productDevelopment'  // Changed from productdevelopment
    };

    const categoryKey = categoryMap[category];
    console.log('Category key:', categoryKey);
    
    if (!categoryKey) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Fetch achievements for all provided emails
    const achievements = await Achievement.find({
      _id: { $in: emails }
    });

    console.log('Found achievements:', achievements.length);

    // Filter results that have data in the selected category
    const results = [];
    
    for (const achievement of achievements) {
      // Check if the category exists and has data
      const categoryData = achievement[categoryKey];
      console.log(`Checking ${achievement._id} for ${categoryKey}:`, categoryData);
      
      if (categoryData && Array.isArray(categoryData) && categoryData.length > 0) {
        // Get student name from personalDetails if available
        let studentName = achievement._id; // default to email
        
        if (achievement.personalDetails && achievement.personalDetails.name) {
          studentName = achievement.personalDetails.name;
        }
        
        results.push({
          studentName: studentName,
          studentEmail: achievement._id,
          achievements: {
            [categoryKey]: categoryData
          }
        });
      }
    }

    console.log('Filtered results:', results.length);

    res.status(200).json({
      success: true,
      count: results.length,
      results
    });

  } catch (error) {
    console.error('Error filtering achievements:', error);
    res.status(500).json({ message: 'Server error while filtering achievements', error: error.message });
  }
});

// POST /api/achievements
router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'document', maxCount: 1 }]), async (req, res) => {
  try {
    // Normalize body fields: multer (multipart) may keep nested JSON as strings
    const rawBody = req.body || {};
    function tryParse(val) {
      if (typeof val === 'string') {
        try { return JSON.parse(val); } catch { return val; }
      }
      return val;
    }
    const rest = {};
    for (const k of Object.keys(rawBody)) rest[k] = tryParse(rawBody[k]);

    const userEmail = rest.userEmail;
    if (!userEmail) return res.status(400).json({ error: 'userEmail is required' });

    // If files were uploaded via multipart (multer), use saved file(s)
    if (req.files && req.files.photo && req.files.photo[0]) {
      // save relative path or convert file to Buffer if you want DB storage
      rest.personalDetails = rest.personalDetails || {};
      rest.personalDetails.photo = {
        // store filename and mimetype
        filename: req.files.photo[0].filename,
        contentType: req.files.photo[0].mimetype,
        // load binary into Buffer if you want to keep in DB
        data: fs.readFileSync(req.files.photo[0].path)
      };
    }

    // If client sent base64 inside JSON (common in your client), convert to Buffer for DB
    if (rest.personalDetails && rest.personalDetails.photo && typeof rest.personalDetails.photo.data === 'string') {
      rest.personalDetails.photo.data = Buffer.from(rest.personalDetails.photo.data, 'base64');
      // ensure filename/contentType preserved if provided
      rest.personalDetails.photo.filename = rest.personalDetails.photo.filename || rest.personalDetails.photo.name || 'upload';
      rest.personalDetails.photo.contentType = rest.personalDetails.photo.contentType || rest.personalDetails.photo.type || 'application/octet-stream';
    }

    const filter = { _id: userEmail };
    const update = { $set: rest };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const achievement = await Achievement.findOneAndUpdate(filter, update, options);
    res.status(200).json({ message: 'Achievement saved', achievement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/achievements?userEmail=someone@example.com
router.get('/', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    if (!userEmail) return res.status(400).json({ message: 'Missing userEmail' });
    const achievement = await Achievement.findById(userEmail);
    if (!achievement) return res.json({ achievement: {} });

    // convert Buffer -> base64 string for JSON response so client can directly use data URL
    const obj = achievement.toObject();
    if (achievement.personalDetails && achievement.personalDetails.photo && achievement.personalDetails.photo.data) {
      const buf = achievement.personalDetails.photo.data;
      if (Buffer.isBuffer(buf)) {
        obj.personalDetails = obj.personalDetails || {};
        obj.personalDetails.photo = obj.personalDetails.photo || {};
        obj.personalDetails.photo.data = buf.toString('base64');
        obj.personalDetails.photo.contentType = achievement.personalDetails.photo.contentType || obj.personalDetails.photo.contentType;
        obj.personalDetails.photo.filename = achievement.personalDetails.photo.filename || obj.personalDetails.photo.filename;
      } else if (obj.personalDetails.photo && obj.personalDetails.photo.data && obj.personalDetails.photo.data.type === 'Buffer') {
        // handle double-serialized Buffer
        obj.personalDetails.photo.data = Buffer.from(obj.personalDetails.photo.data.data).toString('base64');
      }
    }

    res.json({ achievement: obj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/achievements/all
router.get('/all', async (req, res) => {
  try {
    const achievements = await Achievement.find({});
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
});

// DELETE achievement entry by section and index
router.delete('/:userEmail/:section/:index', async (req, res) => {
  const { userEmail, section, index } = req.params;
  try {
    const achievement = await Achievement.findById(userEmail);
    if (!achievement) {
      console.log('Achievement not found for', userEmail);
      return res.status(404).json({ error: 'Achievement not found' });
    }

    if (!Array.isArray(achievement[section])) {
      console.log('Section not found or not array:', section, achievement[section]);
      return res.status(400).json({ error: 'Section not found or not an array' });
    }

    console.log('Before splice:', achievement[section]);
    achievement[section].splice(Number(index), 1);
    console.log('After splice:', achievement[section]);
    await achievement.save();
    console.log('Saved achievement');
    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;