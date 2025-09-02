/**
 * Props:
 * - initial: { first_name/firstName, last_name/lastName, phone_number/phoneNumber }
 * - onSubmit(data): function  // receives snake_case fields
 * - submitLabel: string
 * - onCancel(): function (optional)
 */
export default function CustomerForm({ initial = {}, onSubmit, submitLabel = "Save", onCancel }) {
  const [form, setForm] = useState({
    first_name: initial.first_name ?? initial.firstName ?? "",
    last_name: initial.last_name ?? initial.lastName ?? "",
    phone_number: initial.phone_number ?? initial.phoneNumber ?? "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.first_name || !form.last_name || !form.phone_number) {
      setError("All fields are required.");
      return;
    }
    await onSubmit?.(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <input
        name="first_name"
        placeholder="First name"
        value={form.first_name}
        onChange={handleChange}
      />
      <input
        name="last_name"
        placeholder="Last name"
        value={form.last_name}
        onChange={handleChange}
      />
      <input
        name="phone_number"
        placeholder="Phone number"
        value={form.phone_number}
        onChange={handleChange}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

import { useState } from "react";
