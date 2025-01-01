const express = require('express');
const router = express.Router();
const { readDb ,writeDb } = require('../utils/jsonDb'); 


router.get('/', (req, res) => {
  try {
    const {search} = req.query
    const db = readDb(); 
    const searchHistory = db.searchHistory || []; 
    let searchHistoryItems = searchHistory.filter(item=>item.userId== req.user.id)

    if(search){
        searchHistoryItems = searchHistoryItems.filter(item => item.text.includes(search) 
      ); 
    }
  
    res.json( searchHistoryItems);

  } catch (error) {
    res.status(500).json({ error: 'Failed to read saerch history' });
  }
});

router.post('/', (req, res) => {
  try {
    const db = readDb(); 
    const {text} = req.body
    const {id} = req.user
    const searchHistory = db.searchHistory || []; 
    let searchHistoryItems = searchHistory.filter(item=>item.userId== id)

    if(!searchHistoryItems.find(item=>(item.userId==id && item.text==text)))
    {
      db.searchHistory.push({
        userId:id,
        text:text
      })
      writeDb(db);
        res.status(201).json( "saerch text add to history successfully.");
    }
    else {
        res.status(201).json( "saerch text add to history successfully.");
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add search history' });
  }
});

router.delete('/:text', (req, res) => {
    try {
      const db = readDb(); 
      const {text} = req.params
      const {id} = req.user
      const searchHistory = db.searchHistory || []; 
      let searchHistoryItems = searchHistory.filter(item=>item.userId== id)
    
      if(!text)
      {
        db.searchHistory = searchHistory.filter(item=>item.userId!=id)
        writeDb(db);
        res.status(201).json( "all history search removed from history successfully.");
      }
      else if(searchHistoryItems.find(item=>(item.userId==id && item.text==text)))
      {
        db.searchHistory = searchHistory.filter(item=>!(item.userId==id && item.text==text))
        writeDb(db);
        res.status(201).json( "search text remove from wishlist successfully.");
      }
      else {
        res.status(404).json("searchText not fount to remove")
      }
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Failed to remove from history' });
    }
  });



module.exports = router;
