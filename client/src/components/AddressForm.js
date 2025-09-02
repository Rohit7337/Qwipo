import { useEffect, useState } from "react";

/**
 * Props:
 * - initial: { address_details/addressDetails, city, state, pin_code/pinCode } (optional)
 * - onSubmit(data): function  // receives snake_case payload
 * - onCancel(): function (optional)
 * - submitLabel: string (default "Add")
 */
export default function AddressForm({ initial = {}, onSubmit, onCancel, submitLabel = "Add" }) {
  const [form, setForm] = useState({
    address_details: initial.address_details ?? initial.addressDetails ?? "",
    city: initial.city ?? "",
    state: initial.state ?? "",
    pin_code: initial.pin_code ?? initial.pinCode ?? "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      address_details: initial.address_details ?? initial.addressDetails ?? "",
      city: initial.city ?? "",
      state: initial.state ?? "",
      pin_code: initial.pin_code ?? initial.pinCode ?? "",
    });
  }, [initial]);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.address_details || !form.city || !form.state || !form.pin_code) {
      setError("All fields are required.");
      return;
    }
    await onSubmit?.(form);
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <input
        name="address_details"
        placeholder="Address details"
        value={form.address_details}
        onChange={change}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <input name="city" placeholder="City" value={form.city} onChange={change} />
        <input name="state" placeholder="State" value={form.state} onChange={change} />
        <input name="pin_code" placeholder="PIN" value={form.pin_code} onChange={change} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
