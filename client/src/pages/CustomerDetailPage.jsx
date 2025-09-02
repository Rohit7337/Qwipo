import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCustomer, getAddresses, addAddress, updateAddress, deleteAddress } from "../api";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [cust, setCust] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editing, setEditing] = useState(null); // address id or null
  const [form, setForm] = useState({ address_details: "", city: "", state: "", pin_code: "" });
  const [error, setError] = useState("");

  const load = async () => {
    const [{ data: c }, { data: a }] = await Promise.all([getCustomer(id), getAddresses(id)]);
    setCust(c);
    setAddresses(a.data ?? a);
  };

  useEffect(() => { load(); }, [id]);

  const startEdit = (addr) => {
    setEditing(addr.id);
    setForm({
      address_details: addr.address_details ?? addr.addressDetails,
      city: addr.city, state: addr.state, pin_code: addr.pin_code ?? addr.pinCode
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await updateAddress(editing, form);
      else await addAddress(id, form);
      setEditing(null);
      setForm({ address_details: "", city: "", state: "", pin_code: "" });
      load();
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err.message);
    }
  };

  if (!cust) return <p>Loading…</p>;

  const first = cust.first_name ?? cust.firstName;
  const last = cust.last_name ?? cust.lastName;
  const phone = cust.phone_number ?? cust.phoneNumber;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Link to="/customers">← Back</Link>
      </div>

      <h3>{first} {last}</h3>
      <p>Phone: {phone}</p>

      <h4 style={{ marginTop: 24 }}>Addresses</h4>
      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse", marginBottom: 12 }}>
        <thead style={{ background: "#f4f4f4" }}>
          <tr><th align="left">Address</th><th align="left">City</th><th align="left">State</th><th align="left">PIN</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {addresses.map(a => (
            <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{a.address_details ?? a.addressDetails}</td>
              <td>{a.city}</td>
              <td>{a.state}</td>
              <td>{a.pin_code ?? a.pinCode}</td>
              <td style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button onClick={() => startEdit(a)}>Edit</button>
                <button onClick={async () => { if (confirm("Delete address?")) { await deleteAddress(a.id); load(); } }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!addresses.length && <tr><td colSpan="5">No addresses yet.</td></tr>}
        </tbody>
      </table>

      <h4>{editing ? "Edit Address" : "Add Address"}</h4>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <input
          placeholder="Address details"
          value={form.address_details}
          onChange={e => setForm({ ...form, address_details: e.target.value })}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <input placeholder="City"  value={form.city}  onChange={e => setForm({ ...form, city: e.target.value })} />
          <input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
          <input placeholder="PIN"   value={form.pin_code} onChange={e => setForm({ ...form, pin_code: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{editing ? "Save" : "Add"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ address_details: "", city: "", state: "", pin_code: "" }); }}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
