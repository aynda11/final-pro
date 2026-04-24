const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Company = require('../models/Company');

// Simple JWT auth middleware
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

// Get profile
router.get('/:role', auth, async (req, res) => {
  try {
    const { role } = req.params;
    let user;
    if (role === 'student') user = await Student.findById(req.user.id);
    else if (role === 'company') user = await Company.findById(req.user.id);
    else return res.status(400).json({ msg: 'Invalid role' });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/:role', auth, async (req, res) => {
  try {
    const { role } = req.params;
    // Clone req.body into updateFields (excluding sensitive fields if necessary)
    const updateFields = { ...req.body.profile };
    // Optional: protect certain fields from being updated
    delete updateFields._id;
    delete updateFields.createdAt;

    let user;
    if (role === 'student') {
      user = await Student.findByIdAndUpdate(req.body.profile._id, updateFields, { new: true });
    } else if (role === 'company') {
      user = await Company.findByIdAndUpdate(req.profile.body._id, updateFields, { new: true });
    } else {
      return res.status(400).json({ msg: 'Invalid role' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router; 