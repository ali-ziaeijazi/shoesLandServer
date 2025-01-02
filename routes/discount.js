const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../utils/jsonDb');


router.get('/:discount', (req, res) => {
  try {
    const { discount } = req.params
    const db = readDb();
    const discountList = db.discount || [];

    let discountMatch = discountList.find(item => item.code== discount)

    console.log(discount,discountMatch)
    if (discountMatch) {
      res.json({discount:discountMatch.discount});
    }
    else res.status(404).json({error:"this code not valid"})

  } catch (error) {
    res.status(500).json({ error: 'Failed to read saerch history' });
  }
});

module.exports = router;
