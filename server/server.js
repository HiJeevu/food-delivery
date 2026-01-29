const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve images

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'admin_panel'
});

// Add this route to your server.js
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM admins WHERE username = ? AND password = ?";
    
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).send({ message: "Server error" });
        if (result.length > 0) {
            // In production, send a JWT token here
            res.send({ success: true, user: result[0].username });
        } else {
            res.status(401).send({ success: false, message: "Invalid credentials" });
        }
    });
});
// Image Upload Configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- ITEM MANAGEMENT ---
app.post('/api/items', upload.single('image'), (req, res) => {
    const { name, price, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const sql = "INSERT INTO items (name, price, image, description) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, price, image, description], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Item added successfully" });
    });
});

app.get('/api/items', (req, res) => {
    db.query("SELECT * FROM items", (err, result) => res.send(result));
});

// --- ORDER MANAGEMENT ---
app.get('/api/orders', (req, res) => {
    db.query("SELECT * FROM orders ORDER BY order_date DESC", (err, result) => res.send(result));
});

app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Status updated" });
    });
});
// Add this below your existing item routes in server.js
app.delete('/api/items/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM items WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Item deleted successfully" });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));