const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../utils/jsonDb');


router.get('/', (req, res) => {
  try {
    const id = req.user.id
    const { isSelected } = req.query
    const db = readDb();
    const address = db.address || [];

    let addressItem = address.filter(item => item.userId == id)
    if (isSelected) {
      selectedItem = addressItem.find(item => item.isSelected)
      if(selectedItem)
        res.json({ name: selectedItem.name, address: selectedItem.address, isSelected: selectedItem.isSelected })
      else res.status(404).json({ message: 'not found any default address for user' });
    }
    res.json(addressItem.map(item => ({ name: item.name, address: item.address, isSelected: item.isSelected })));

  } catch (error) {
    console.log("address:get: ",error)
    res.status(500).json({ message: 'Failed to get address list' });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, address } = req.body
    const { id } = req.user
    const db = readDb();
    const addresses = db.address || [];
    let addressItem = addresses.filter(item => item.userId == id)

    let isInAddressList = addressItem.find(item => item.name == name)
    if (address) {
      if (!isInAddressList) {
        db.address.push({
          userId: id,
          name: name,
          address: address,
          isSelected: false
        })
        res.status(201).json({message:"address add to user addersses."});
      }
      else {
        res.status(409).json({message:"an address have dupplicate name with another address.Please add address with another name."})
      }
    }
    else {
      addressItem.forEach(item => {
        item.isSelected = false
      });
      isInAddressList.isSelected = true
      res.status(201).json({message:"address selected for defualt address."});

    }
    writeDb(db);
  } catch (error) {
    console.log("address:create: ",error)
    res.status(500).json({ message: 'Failed to add address to user Addresses' });
  }
});

router.put('/:name', (req, res) => {
  try {
    const { address } = req.body
    const { name} = req.params
    const { id } = req.user
    const db = readDb();
    const addresses = db.address || [];
    let addressItem = addresses.filter(item => item.userId == id)

    let isInAddressList = addressItem.find(item => item.name == name)
    if (isInAddressList) {
      isInAddressList.address = address
      res.status(200).json({message:"address Edited successfully"});
    }
    else {
      res.status(404).json({message:"an address not found to edit"})
    }
    writeDb(db);
  }
  catch (error) {
    console.log("address:update: ",error)
    res.status(500).json({ message: 'Failed to edit address from user Addresses' });
  }
});

router.delete('/:name', (req, res) => {
  try {
    const { name } = req.params
    const { id } = req.user
    const db = readDb();
    const addresses = db.address || [];
    let addressItem = addresses.filter(item => item.userId == id)
    const isInAddressList = addressItem.find(item => item.name == name)
    if(isInAddressList)
    {
      db.address = db.address.filter(item=>!(item.name==name && item.userId == id))
      res.status(200).json({message:"address remove form user address list successfully"});
      writeDb(db);
    }
    else {
      res.status(404).json({message:"address not found to remove from address list"});
    }
  } catch (error) {
    console.log("address:delete: ",error)
    res.status(500).json({ message: 'Failed to remove from cart list' });
  }
});



module.exports = router;
