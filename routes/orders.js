const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../utils/jsonDb');


router.get('/', (req, res) => {
  try {
    const { search, status } = req.query
    const id = req.user.id
    const db = readDb();
    const orders = db.orders || [];
    let ordersList = orders.filter(item => item.userId == id)
    if (status == "completed" || status == "indelivery") {
      ordersList = ordersList.filter(item => item.status == status)
    }
    if (search) {
      ordersList = ordersList.filter(item => item.name.includes(search));
    }
    res.json(ordersList);

  } catch (error) {
    res.status(500).json({ error: 'Failed to get order list' });
  }
});

router.post('/', (req, res) => {
  try {
    const db = readDb();
    const { products, discount = 0 } = req.body
    const { id } = req.user
    let cart = db.cart || []
    let orders = db.orders || []
    const newOrders = []
    products.forEach(product => {
      const newObj = {
        userId: id,
        status: "indelivery",
        name: product.name,
        productId: product.productId,
        count: product.count,
        color: product.color,
        size: product.size,
        images: product.images,
        price: product.price * (1 - (discount / 100)),
        total_price: product.total_price * (1 - (discount / 100))
      }
      newOrders.push(newObj)
      cart = cart.filter(item => !(item.userId == id && item.productId == product.productId))
    });

    orders.push(...newOrders)
    db.orders = orders
    db.cart = cart
    writeDb(db)
    res.status(201).json("orders created successfully")
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to add product to orders' });
  }
});



router.post('/changeStatus', (req, res) => {
  try {
    const db = readDb();
    const { products } = req.body
    const { id } = req.user
    products.forEach(product => {
      found = db.orders.find(item => item.userId == id && item.productId == product)
      if (found)
        found.status = "completed"
    });
    writeDb(db)
    res.status(201).json("orders status changed successfully")
  } catch (error) {
    res.status(500).json({ error: 'Failed to change status product to orders' });
  }
});

module.exports = router;
