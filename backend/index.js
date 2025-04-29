const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());  // to parse JSON data

// Set up the uploads directory to store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Store uploaded images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Give the uploaded file a unique name based on timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the storage settings
const upload = multer({ storage: storage });

// POST route to handle product submission
app.post('/add-product', upload.single('image'), (req, res) => {
  const { name, description, price, menu } = req.body;
  const image = req.file ? req.file.filename : null;

  // Here you can handle database saving or other processing
  
  console.log({ name, description, price, menu, image });  // Log product data to console

  // Respond with a success message
  res.status(200).json({ message: 'Product received!', data: req.body, image });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
