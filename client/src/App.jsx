import { Link, Routes, Route, Navigate } from "react-router-dom";
import CustomerListPage from "./pages/CustomerListPage.jsx";
import CustomerFormPage from "./pages/CustomerFormPage.jsx";
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";

export default function App() {
  return (
    <div style={{ maxWidth: 920, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Customer Manager</h2>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/customers">Customers</Link>
          <Link to="/customers/new">New</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/new" element={<CustomerFormPage mode="create" />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage mode="edit" />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </div>
  );
}
