const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');
const Student = require('../models/Student');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
}

// Apply to opportunity (student, with file upload)
router.post('/apply/:oppId', auth, upload.single('resume'), async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Forbidden' });
  const { coverLetter } = req.body;
  const resumePath = req.file ? `/uploads/${req.file.filename}` : '';
  const application = await Application.create({
    student: req.user.id,
    opportunity: req.params.oppId,
    resume: resumePath,
    coverLetter,
  });
  await Student.findByIdAndUpdate(req.user.id, { $push: { applications: application._id } });
  await Opportunity.findByIdAndUpdate(req.params.oppId, { $push: { applicants: req.user.id } });
  res.json(application);
});

// Get all applications for student
router.get('/student', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ msg: 'Forbidden' });
  const apps = await Application.find({ student: req.user.id }).populate('opportunity');
  res.json(apps);
});

// Get all applications for company
router.get('/company', auth, async (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ msg: 'Forbidden' });
  const apps = await Application.find().populate({
    path: 'opportunity',
    match: { company: req.user.id },
  }).populate('student');
  res.json(apps.filter(a => a.opportunity));
});

// Update application status (company)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ msg: 'Forbidden' });
  const { status } = req.body;
  const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(app);
});

// Schedule interview (company)
router.put('/:id/interview', auth, async (req, res) => {
  if (req.user.role !== 'company') return res.status(403).json({ msg: 'Forbidden' });
  const { interview } = req.body; // { date, time, link }
  const app = await Application.findByIdAndUpdate(req.params.id, { interview, status: 'interview' }, { new: true });
  res.json(app);
});

module.exports = router; 