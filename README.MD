# Customer Management App

A full-stack CRUD application built with:

- **Backend**: Node.js, Express.js, SQLite  
- **Frontend**: React.js, React Router, Axios, Vite  

The app demonstrates customer management with multiple addresses, including validation, pagination, and search features.  

---

## 📌 Features

- **Customer CRUD**
  - Create, read, update, and delete customers
  - Validation on both client & server
  - Unique phone number constraint

- **Address CRUD**
  - Manage multiple addresses for each customer
  - One-to-many relation (`customers → addresses`)

- **Search & Filters**
  - Filter customers by city/state/pincode
  - Clear filters to reset

- **Pagination**
  - Navigate through customer list with `page` query params

- **Navigation**
  - Dynamic routes using React Router
  - `/customers/:id` for customer details

- **Error Handling**
  - Proper messages for constraints, missing fields, and server errors

---

## ⚙️ Tech Stack

- **Frontend**: React, React Router, Axios, Vite  
- **Backend**: Node.js, Express.js, SQLite3  
- **Database**: SQLite (`app.db`)  
- **Tooling**: npm, ES Modules  

---

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/Rohit7337/customer-management-app.git
cd customer-management-app
```

### 2. Backend Setup
```bash
cd server
npm install
node index.js
```

Runs backend at:  
👉 `http://localhost:5001/api`

---

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

Runs frontend at:  
👉 `http://localhost:5173`

---
