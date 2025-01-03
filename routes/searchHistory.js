const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../utils/jsonDb');


router.get('/', (req, res) => {
  try {
    const { search } = req.query
    const db = readDb();
    const searchHistory = db.searchHistory || [];
    let searchHistoryItems = searchHistory.filter(item => item.userId == req.user.id)

    if (search) {
      searchHistoryItems = searchHistoryItems.filter(item => item.text.includes(search)
      );
    }

    res.json(searchHistoryItems);

  } catch (error) {
    console.log("searchHistory:get: ",error)
    res.status(500).json({ message: 'Failed to read saerch history' });
  }
});

router.post('/', (req, res) => {
  try {
    const db = readDb();
    const { text } = req.body
    const { id } = req.user
    const searchHistory = db.searchHistory || [];
    let searchHistoryItems = searchHistory.filter(item => item.userId == id)

    if (!searchHistoryItems.find(item => (item.userId == id && item.text == text))) {
      db.searchHistory.push({
        userId: id,
        text: text
      })
      writeDb(db);
      res.status(201).json({message:"saerch text add to history successfully."});
    }
    else {
      res.status(201).json({message:"saerch text add to history successfully."});
    }
  } catch (error) {
    console.log("searchHistory:post: ",error)
    res.status(500).json({ message: 'Failed to add search history' });
  }
});

router.delete('/', (req, res) => {
  try {
    const db = readDb();
    const { text } = req.params
    const { id } = req.user
    const searchHistory = db.searchHistory || [];


    db.searchHistory = searchHistory.filter(item => item.userId != id)
    writeDb(db);
    res.status(201).json({message:"all history search removed from history successfully."});
  } catch (error) {
    console.log("searchHistory:delete: ",error)
    res.status(500).json({ message: 'Failed to remove from history' });
  }
});

router.delete('/:text', (req, res) => {
  try {
    const db = readDb();
    const { text } = req.params
    const { id } = req.user
    const searchHistory = db.searchHistory || [];
    let searchHistoryItems = searchHistory.filter(item => item.userId == id)

    if (searchHistoryItems.find(item => (item.userId == id && item.text == text))) {
      db.searchHistory = searchHistory.filter(item => !(item.userId == id && item.text == text))
      writeDb(db);
      res.status(201).json({message:"search text remove from wishlist successfully."});
    }
    else {
      res.status(404).json({message:"searchText not fount to remove"})
    }
  } catch (error) {
    console.log("searchHistory:delete: ",error)
    res.status(500).json({ message: 'Failed to remove from history' });
  }
});



module.exports = router;
