const express = require('express');
const db = require('./db');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());  

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/add-product', upload.single('image'), (req, res) => {
    const { name, description, price, menu } = req.body;
    const image = req.file ? req.file.filename : null;
  
    const sql = 'INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, description, price, menu, image], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.status(200).json({ message: 'Product added successfully', productId: result.insertId });
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});