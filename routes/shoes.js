const express = require('express');
const { readDb } = require('../utils/jsonDb'); // استفاده از readDb برای خواندن داده‌ها
const router = express.Router();

// دریافت برندهای کفش
router.get('/', (req, res) => {
  try {
    const db = readDb(); // خواندن داده‌ها از فایل JSON
    const shoeBrands = db.brands || []; // دسترسی به برندها از کلید 'brands'
    
    if (shoeBrands.length === 0) {
      return res.status(404).json({ error: 'No shoe brands found' });
    }

    res.json(shoeBrands); // ارسال برندها به کاربر
  } catch (error) {
    res.status(500).json({ error: 'Failed to read shoe brands' });
  }
});

module.exports = router;
