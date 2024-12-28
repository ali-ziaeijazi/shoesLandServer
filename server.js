require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors');
const fs = require('fs')
const https = require('https');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const shoeRoutes = require('./routes/shoes');  
const productRoutes = require('./routes/products'); 
const wishlistRoutes = require('./routes/wishlist'); 
const optionalAuthenticateToken = require('./routes/optionalProtected')
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // دامنه مجاز (جایگزین با دامنه فرانت‌اند)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // متدهای مجاز
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization' ], // هدرهای مجاز
  
  credentials: true,
};

const options = {
  key: fs.readFileSync('./keys/localhost-key.pem'),
  cert: fs.readFileSync('./keys/localhost.pem'),
};

app.use(cors(corsOptions));
// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/api/wishlist', protectedRoutes,wishlistRoutes);
app.use('/api/brands',optionalAuthenticateToken, shoeRoutes); 
app.use('/api/products',optionalAuthenticateToken, productRoutes); 


app.use(express.static(path.join(__dirname, 'public')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// https.createServer(options, app).listen(443, () => {
//   console.log('Server is running on https://localhost');
// });