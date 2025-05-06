const express = require('express');
const db = require('./db');
const verificationEmail = require('./mailer');
const multer = require('multer');
const cors = require('cors');
const crypto = require('crypto');
const session = require('express-session');
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
  db.query(sql, [name, description, price, category,image], (err, result) => {
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
    res.status(200).json({p : result});
  });
});

app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  console.log(name+email+password)
  const code = crypto.randomInt(100000, 999999).toString();

  req.session.verification = { email, name, password, code };

  verificationEmail(email, code);

  res.status(200).json({ message: 'Verification code sent to email' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});