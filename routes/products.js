const express = require('express');
const router = express.Router();
const { readDb } = require('../utils/jsonDb'); 


router.get('/', (req, res) => {
  try {
    const { brands, is_popular,colors,sizes,search} = req.query; 

    const db = readDb(); 
    const products = db.products || []; 

   
    let filteredProducts = products;
    if (brands) {
      filteredProducts = filteredProducts.filter(product => 
        brands.includes(product.brand.name.toLowerCase())
      );
    }

    
    if (is_popular !== undefined) {
      const isPopularBool = is_popular === 'true'; 
      filteredProducts = filteredProducts.filter(product => 
        product.is_popular === isPopularBool
      );
    }

    if(colors){
      filteredProducts = filteredProducts.filter(product => 
        product.colors.filter(color=>colors.includes(color)).length!=0
      ); 
    }

    if(search){
      filteredProducts = filteredProducts.filter(product => 
      {
        console.log(product.brand,product.name)
        return (product.name.includes(search) || product.description.includes(search) || product.brand.name.includes(search) )
      }
      ); 
    }

    if(sizes){
      filteredProducts = filteredProducts.filter(product => 
        product.sizes.filter(size=>sizes.includes(size)).length!=0
      ); 
    }


    if (filteredProducts.length === 0) {
      return res.status(404).json({ error: 'No products found matching the criteria.' });
    }

   
    const productsWithPopularity = filteredProducts.map(product => {
      return product;
    });

    
    res.json( productsWithPopularity);

  } catch (error) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const { id} = req.params; 
    console.log("test",id)
    const db = readDb(); 
    const products = db.products || []; 

   
    let filteredProducts = products.find(product=>product.id==id);
    


    if (!filteredProducts) {
      return res.status(404).json({ error: 'No products found matching the criteria.' });
    }
    
    res.json( filteredProducts);

  } catch (error) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});



module.exports = router;
