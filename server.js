require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const shoeRoutes = require('./routes/shoes');  
const productRoutes = require('./routes/products'); 
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api/brands', shoeRoutes); 
app.use('/api/products', productRoutes); 

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
