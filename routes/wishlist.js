const express = require('express');
const router = express.Router();
const { readDb ,writeDb } = require('../utils/jsonDb'); 


router.get('/', (req, res) => {
  try {
    const {search,brands,colors,sizes} = req.query
    const db = readDb(); 
    const wishlist = db.wishlist || []; 
    const products = db.products || []; 

   
    let wishlistItem = []
     wishlist.filter(item=>item.userId== req.user.id).forEach(item=>{
      const product = products.find(product=>product.id==item.productId)
      if(product)
      {
        wishlistItem.push({...product,isFavorite:true})
      }
    })

    if (brands) {
      wishlistItem = wishlistItem.filter(item =>
        brands.includes(item.brand.name.toLowerCase())
      );
    }
   
    if (colors) {
      wishlistItem = wishlistItem.filter(item =>
        item.colors.filter(color => colors.includes(color)).length != 0
      );
    }


    if (wishlistItem) {
      filteredProducts = wishlistItem.filter(item =>
        item.sizes.filter(size => sizes.includes(size)).length != 0
      );
    }


    if(search){
      wishlistItem = wishlistItem.filter(item => 
      {
        return (item.name.includes(search) || item.description.includes(search) || item.brand.name.includes(search) )
      }
      ); 
    }
  
    res.json( wishlistItem);

  } catch (error) {
    res.status(500).json({ error: 'Failed to read wishlist' });
  }
});

router.post('/', (req, res) => {
  try {
    const { productId} = req.body; 
    const id = req.user.id
    const db = readDb(); 
    const wishlist = db.wishlist || []; 

    if(wishlist.find(item=>(item,item.userId==id && item.productId==productId)))
    {
        db.wishlist = wishlist.filter(item=>!(item.userId==id && item.productId==productId))
        writeDb(db);
        res.status(201).json( "product remove from wishlist successfully.");
    }
    else{
      db.wishlist.push({
        userId:id,
        productId:productId
      })
      writeDb(db);
        res.status(201).json( "product add to wishlist successfully.");
    }

  
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to add/remove from wishlist' });
  }
});



module.exports = router;
