// server/index.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ---- DB --------------------------------------------------------------------
const DB_FILE = path.resolve(__dirname, 'app.db');
console.log('Using DB file:', DB_FILE);

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite:', DB_FILE);
});
db.serialize(() => db.run('PRAGMA foreign_keys = ON;'));

// ---- Helpers ---------------------------------------------------------------
// allow camelCase or snake_case from clients
function toSnakeCustomer(body) {
  return {
    first_name:  body.first_name  ?? body.firstName  ?? null,
    last_name:   body.last_name   ?? body.lastName   ?? null,
    phone_number:body.phone_number?? body.phoneNumber?? null,
  };
}
function toSnakeAddress(body) {
  return {
    address_details: body.address_details ?? body.addressDetails ?? null,
    city:            body.city ?? null,
    state:           body.state ?? null,
    pin_code:        body.pin_code ?? body.pinCode ?? null,
  };
}
function toCamel(row) {
  if (!row) return row;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phoneNumber: row.phone_number,
    addressDetails: row.address_details,
    city: row.city,
    state: row.state,
    pinCode: row.pin_code,
    customerId: row.customer_id,
  };
}

// ---- Customer Routes -------------------------------------------------------

// Create new customer
app.post('/api/customers', (req, res) => {
  const { first_name, last_name, phone_number } = toSnakeCustomer(req.body);

  if (!first_name || !last_name || !phone_number) {
    return res.status(422).json({
      message: 'Missing required fields',
      required: ['first_name', 'last_name', 'phone_number'],
    });
  }

  const sql = `INSERT INTO customers (first_name, last_name, phone_number)
               VALUES (?, ?, ?)`;
  db.run(sql, [first_name, last_name, phone_number], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json(
      toCamel({ id: this.lastID, first_name, last_name, phone_number })
    );
  });
});

// Get all customers
app.get('/api/customers', (req, res) => {
  const sql = `SELECT * FROM customers`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'success', data: rows.map(toCamel) });
  });
});

// Get customer by id (with addresses)
app.get('/api/customers/:id', (req, res) => {
  const id = req.params.id;

  db.get(`SELECT * FROM customers WHERE id = ?`, [id], (err, customer) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    db.all(`SELECT * FROM addresses WHERE customer_id = ?`, [id], (aerr, addrs) => {
      if (aerr) return res.status(400).json({ error: aerr.message });
      res.json({ ...toCamel(customer), addresses: addrs.map(toCamel) });
    });
  });
});

// Update customer
app.put('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, phone_number } = toSnakeCustomer(req.body);

  const sql = `UPDATE customers
               SET first_name  = COALESCE(?, first_name),
                   last_name   = COALESCE(?, last_name),
                   phone_number= COALESCE(?, phone_number)
               WHERE id = ?`;
  db.run(sql, [first_name, last_name, phone_number, id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Customer not found' });

    db.get(`SELECT * FROM customers WHERE id = ?`, [id], (gerr, row) => {
      if (gerr) return res.status(400).json({ error: gerr.message });
      res.json(toCamel(row));
    });
  });
});

// Delete customer
app.delete('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM customers WHERE id = ?`, [id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  });
});

// ---- Address Routes --------------------------------------------------------

// Add new address for customer
app.post('/api/customers/:id/addresses', (req, res) => {
  const customerId = req.params.id;
  const { address_details, city, state, pin_code } = toSnakeAddress(req.body);

  if (!address_details || !city || !state || !pin_code) {
    return res.status(422).json({
      message: 'Missing required fields',
      required: ['address_details', 'city', 'state', 'pin_code'],
    });
  }

  const sql = `INSERT INTO addresses (customer_id, address_details, city, state, pin_code)
               VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [customerId, address_details, city, state, pin_code], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json(
      toCamel({
        id: this.lastID,
        customer_id: Number(customerId),
        address_details,
        city,
        state,
        pin_code,
      })
    );
  });
});

// Get addresses for a customer
app.get('/api/customers/:id/addresses', (req, res) => {
  const customerId = req.params.id;
  db.all(`SELECT * FROM addresses WHERE customer_id = ?`, [customerId], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'success', data: rows.map(toCamel) });
  });
});

// Update address
app.put('/api/addresses/:addressId', (req, res) => {
  const addressId = req.params.addressId;
  const { address_details, city, state, pin_code } = toSnakeAddress(req.body);

  const sql = `UPDATE addresses
               SET address_details = COALESCE(?, address_details),
                   city            = COALESCE(?, city),
                   state           = COALESCE(?, state),
                   pin_code        = COALESCE(?, pin_code)
               WHERE id = ?`;
  db.run(sql, [address_details, city, state, pin_code, addressId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Address not found' });

    db.get(`SELECT * FROM addresses WHERE id = ?`, [addressId], (gerr, row) => {
      if (gerr) return res.status(400).json({ error: gerr.message });
      res.json(toCamel(row));
    });
  });
});

// Delete address
app.delete('/api/addresses/:addressId', (req, res) => {
  const addressId = req.params.addressId;
  db.run(`DELETE FROM addresses WHERE id = ?`, [addressId], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted' });
  });
});

// ---- Start -----------------------------------------------------------------
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
