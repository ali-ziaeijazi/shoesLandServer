const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../utils/jsonDb');


router.get('/', (req, res) => {
  try {
    const { search } = req.query
    const db = readDb();
    const cart = db.cart || [];
    const products = db.products || []



    let cartItems = []
    cart.filter(item => item.userId == req.user.id).forEach(item => {
      const product = products.find(product => product.id == item.productId)
      if (product) {
        cartItems.push({ name: product.name, count: item.count, price: item.price, color: item.color, size: item.size, images: product.images, productId: item.productId })
      }
    })


    if (search) {
      cartItems = cartItems.filter(item => item.name.includes(search)
      );
    }

    res.json(cartItems);

  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart list' });
  }
});

router.post('/', (req, res) => {
  try {
    const db = readDb();
    const { productId, color, size, count } = req.body
    const { id } = req.user
    const cart = db.cart || [];
    let cartItems = cart.filter(item => item.userId == id)
    if (!cartItems.find(item => item.productId == productId)) {
      db.cart.push({
        userId: id,
        productId: productId,
        color: color,
        size: size,
        count: count
      })
      writeDb(db);
      res.status(201).json("product add to cart.");
    }
    else {
      const found = cartItems.find(item => item.productId == productId)
      found.count = count
      found.color = color
      found.size = size
      writeDb(db);
      res.status(200).json("This product has already been added to the shopping cart")
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

router.put('/', (req, res) => {
  try {
    const db = readDb();
    const { productId, color, size, count } = req.body
    const { id } = req.user
    const cart = db.cart || [];
    let cartItems = cart.filter(item => item.userId == id)
    if (cartItems.find(item => item.productId == productId)) {
      if (count == 0) {
        db.cart = cart.filter(item => !(item.userId == id && item.productId == productId))
      }
      else {
        const found = cartItems.find(item => item.productId == productId)
        found.count = count ?? found.count
        found.color = color ?? found.color
        found.size = size ?? found.size
      }

      writeDb(db);
      res.status(200).json("information of product updated from cart list");
    }
    else {
      res.status(404).json("Product Not found to update form cart list");

    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product in cart list' });
  }
});

router.delete('/:productId', (req, res) => {
  try {
    const db = readDb();
    const { productId } = req.params
    const { id } = req.user
    const cart = db.cart || [];

    console.log(productId, cart.find(item => (item.userId == id && item.productId == productId)))
    if (productId && cart.find(item => (item.userId == id && item.productId == productId))) {
      db.cart = cart.filter(item => !(item.userId == id && item.productId == productId))
      writeDb(db);
      res.status(200).json("product remove form cart list successfully");
    }
    else {
      res.status(404).json("product not found to remove from cart list");

    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to remove from cart list' });
  }
});



module.exports = router;
