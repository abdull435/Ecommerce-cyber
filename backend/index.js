const express = require('express');
const db = require('./db');
const verificationEmail = require('./mailer');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const { on } = require('events');
const app = express();
const PORT = 3000;

app.use(express.json());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(session({
  secret: 'your-secret-key', // Change this to a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true only if using HTTPS
}));

// API to handle product upload
app.post('/add-product', upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = 'INSERT INTO products (name, description, price, category,imgaddress) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, description, price, category, image], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ message: 'Product saved!', productId: result.insertId });
  });
});

app.get('/home', (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json({ p: result });
  });
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  const code = crypto.randomInt(100000, 999999).toString();

  req.session.verification = { email, name, password, code };

  verificationEmail(email, code);

  res.status(200).json({ message: 'Verification code sent to email' });
});

app.post('/verify', async (req, res) => {
  const { code } = req.body;

  if (!req.session.verification) {
    return res.status(400).json({ message: 'No verification session found.' });
  }

  const { email, name, password, code: sessionCode } = req.session.verification;

  if (code !== sessionCode) {
    return res.status(400).json({ message: 'Invalid verification code.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Database error during user registration:', err);
        return res.status(500).json({ message: 'Failed to register user.' });
      }

      req.session.verification = null; // Clear session after success
      return res.status(200).json({ message: 'Verification successful. Account created.' });
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the password with the hashed password stored in the database
    const user = result[0];
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.userId = user.id;  // Store the user's session
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
  });
});

app.get('/checklogin', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({
      loggedIn: true
    });
  } else {
    res.status(200).json({ loggedIn: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

app.post('/add-to-cart', (req, res) => {
  console.log(req.body.Description);
  // if (!req.session.userId) {
  //   return res.status(401).json({ message: 'Please log in to add items to cart.' });
  // }

  const { Name, Description, qty, Price, Total } = req.body;



  if (!req.session.cart) {
    req.session.cart = [];
  }

  const existingItemIndex = req.session.cart.findIndex(item => item.name === Name);

  if (existingItemIndex !== -1) {
    // If the item already exists, update the quantity and total price
    req.session.cart[existingItemIndex].quantity += qty;
    req.session.cart[existingItemIndex].total += Total;
    // Optionally, update the price per item if needed
    req.session.cart[existingItemIndex].pricePerItem = Price;
  } else {

    const cartItem = {
      name: Name,
      description: Description,
      quantity: qty,
      pricePerItem: Price,
      total: Total
    };
    req.session.cart.push(cartItem);
   
  }
  console.log(req.session.cart);

  res.status(200).json({ message: 'Item added to cart.', cart: req.session.cart });
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});