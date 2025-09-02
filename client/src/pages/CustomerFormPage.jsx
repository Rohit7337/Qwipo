import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCustomer, getCustomer, updateCustomer } from "../api";

export default function CustomerFormPage({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ first_name: "", last_name: "", phone_number: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      getCustomer(id).then(r => {
        const c = r.data;
        setForm({
          first_name: c.first_name ?? c.firstName ?? "",
          last_name: c.last_name ?? c.lastName ?? "",
          phone_number: c.phone_number ?? c.phoneNumber ?? "",
        });
      });
    }
  }, [isEdit, id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.first_name || !form.last_name || !form.phone_number) {
      setError("All fields are required"); return;
    }
    try {
      if (isEdit) await updateCustomer(id, form);
      else await createCustomer(form);
      nav("/customers");
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err.message);
    }
  };

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div>
      <h3>{isEdit ? "Edit" : "New"} Customer</h3>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input name="first_name" placeholder="First name" value={form.first_name} onChange={change} />
        <input name="last_name"  placeholder="Last name"  value={form.last_name} onChange={change} />
        <input name="phone_number" placeholder="Phone number" value={form.phone_number} onChange={change} />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{isEdit ? "Save" : "Create"}</button>
          <button type="button" onClick={() => nav(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
