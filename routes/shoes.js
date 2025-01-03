const express = require('express');
const { readDb } = require('../utils/jsonDb'); 
const router = express.Router();


router.get('/', (req, res) => {
  try {
    const db = readDb(); 
    const shoeBrands = db.brands || []; 
    
    if (shoeBrands.length === 0) {
      return res.status(404).json({ message: 'No shoe brands found' });
    }

    res.json(shoeBrands);
  } catch (error) {
    console.log("brands:get: ",error)
    res.status(500).json({ message: 'Failed to read shoe brands' });
  }
});

module.exports = router;
