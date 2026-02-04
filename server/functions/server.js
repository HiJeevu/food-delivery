const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const serverless = require('serverless-http');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging middleware
app.use('/uploads', express.static('uploads')); // Serve images

// MySQL Connection
const db = mysql.createConnection({
    host: 'bpoqp2gnutcgcpgih1sw-mysql.services.clever-cloud.com',
    user: 'updejmwe7fx8gkys',
    password: 'QSNSsJ4VlmVF3s4rCgTH',
    database: 'bpoqp2gnutcgcpgih1sw'
});

// --- ADMIN LOGIN ---

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM admins WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (result.length > 0) {
            res.send({ success: true, role: 'admin', user: result[0] });
        } else {
            res.status(401).send({ message: "Invalid Admin Credentials" });
        }
    });
});

// --- USER REGISTER & LOGIN ---
app.post('/api/user/register', (req, res) => {
    const { name, email, password } = req.body;
    db.query("INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)", [name, email, password], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ success: true });
    });
});

app.post('/api/user/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (result.length > 0) {
            res.send({ success: true, role: 'user', user: result[0] });
        } else {
            res.status(401).send({ message: "Invalid User Credentials" });
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

// --- PLACE ORDER (Now with Items) ---
app.post('/api/orders', (req, res) => {
    const { customer_name, address, phone, total_amount, cart } = req.body;

    // 1. Insert into orders table first
    const orderSql = "INSERT INTO orders (customer_name, address, phone, total_amount, status) VALUES (?, ?, ?, ?, 'Pending')";

    db.query(orderSql, [customer_name, address, phone, total_amount], (err, result) => {
        if (err) return res.status(500).send(err);

        const orderId = result.insertId;

        // 2. Prepare cart items for bulk insertion
        // Format: [[orderId, name, price, qty], [orderId, name, price, qty]]
        const itemValues = cart.map(item => [orderId, item.name, item.price, item.qty]);
        const itemsSql = "INSERT INTO order_items (order_id, product_name, price, quantity) VALUES ?";

        db.query(itemsSql, [itemValues], (err) => {
            if (err) return res.status(500).send(err);
            res.send({ success: true, orderId: orderId });
        });
    });
});

app.get('/api/orders', (req, res) => {
    db.query("SELECT * FROM orders ORDER BY order_date DESC", (err, result) => res.send(result));
});

// Get specific order status for Customer Tracking
app.get('/api/orders/track/:id', (req, res) => {
    const orderId = req.params.id;

    // Fetch order details
    const orderQuery = "SELECT * FROM orders WHERE id = ?";
    db.query(orderQuery, [orderId], (err, orderResult) => {
        if (err) return res.status(500).send(err);
        if (orderResult.length === 0) return res.status(404).send("Order not found");

        // Fetch associated items
        const itemsQuery = "SELECT * FROM order_items WHERE order_id = ?";
        db.query(itemsQuery, [orderId], (err, itemsResult) => {
            if (err) return res.status(500).send(err);

            // Send back combined data
            res.send({
                ...orderResult[0],
                items: itemsResult
            });
        });
    });
});

app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    db.query("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Status updated" });
    });
});

// Update Item (Manage Details)
app.put('/api/items/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;
    let sql = "";
    let params = [];

    if (req.file) {
        // If a new image is uploaded
        const image = req.file.filename;
        sql = "UPDATE items SET name = ?, price = ?, description = ?, image = ? WHERE id = ?";
        params = [name, price, description, image, id];
    } else {
        // If keeping the existing image
        sql = "UPDATE items SET name = ?, price = ?, description = ? WHERE id = ?";
        params = [name, price, description, id];
    }

    db.query(sql, params, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Item updated successfully" });
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
export const handler = serverless(app);