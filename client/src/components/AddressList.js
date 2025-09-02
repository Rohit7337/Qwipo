/**
 * Props:
 * - addresses: array of { id, address_details/addressDetails, city, state, pin_code/pinCode }
 * - onEdit(address): function
 * - onDelete(id): function
 */
export default function AddressList({ addresses = [], onEdit, onDelete }) {
  return (
    <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse", marginBottom: 12 }}>
      <thead style={{ background: "#f4f4f4" }}>
        <tr>
          <th align="left">Address</th>
          <th align="left">City</th>
          <th align="left">State</th>
          <th align="left">PIN</th>
          <th align="left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {addresses.map(a => (
          <tr key={a.id} style={{ borderBottom: "1px solid #eee" }}>
            <td>{a.address_details ?? a.addressDetails}</td>
            <td>{a.city}</td>
            <td>{a.state}</td>
            <td>{a.pin_code ?? a.pinCode}</td>
            <td style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onEdit?.(a)}>Edit</button>
              <button onClick={() => onDelete?.(a.id)}>Delete</button>
            </td>
          </tr>
        ))}
        {!addresses.length && (
          <tr><td colSpan="5">No addresses.</td></tr>
        )}
      </tbody>
    </table>
  );
}
