require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors');



const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const shoeRoutes = require('./routes/shoes');  
const productRoutes = require('./routes/products'); 
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // دامنه مجاز (جایگزین با دامنه فرانت‌اند)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // متدهای مجاز
  allowedHeaders: ['Content-Type', 'Authorization'], // هدرهای مجاز
};

app.use(cors(corsOptions));
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/api/brands', shoeRoutes); 
app.use('/api/products', productRoutes); 


app.use(express.static(path.join(__dirname, 'public')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
