const express = require('express');
const router = express.Router();
const { readDb } = require('../utils/jsonDb'); // فرض می‌کنیم که شما از این برای خواندن دیتابیس استفاده می‌کنید

// دریافت لیست محصولات یا فیلتر شده بر اساس برندها و محبوبیت
router.get('/', (req, res) => {
  try {
    const { brands, is_popular } = req.query; // دریافت برندها و وضعیت محبوبیت از پارامتر کوئری

    const db = readDb(); // خواندن داده‌ها از فایل JSON
    const products = db.products || []; // دسترسی به محصولات از کلید 'products'

    // فیلتر کردن محصولات بر اساس برندها
    let filteredProducts = products;
    if (brands) {
      filteredProducts = filteredProducts.filter(product => 
        brands.includes(product.brand.name.toLowerCase())
      );
    }

    // فیلتر کردن محصولات بر اساس وضعیت محبوبیت (is_popular)
    if (is_popular !== undefined) {
      const isPopularBool = is_popular === 'true'; // تبدیل به boolean
      filteredProducts = filteredProducts.filter(product => 
        product.is_popular === isPopularBool
      );
    }

    if (filteredProducts.length === 0) {
      return res.status(404).json({ error: 'No products found matching the criteria.' });
    }

    // اضافه کردن فیلد 'isPopular' به هر محصول
    const productsWithPopularity = filteredProducts.map(product => {
      return product;
    });

    // ارسال محصولات فیلتر شده به کاربر
    res.json( productsWithPopularity);

  } catch (error) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

module.exports = router;
