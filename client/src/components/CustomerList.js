import { Link } from "react-router-dom";

/**
 * Props:
 * - customers: array of { id, first_name/firstName, last_name/lastName, phone_number/phoneNumber }
 * - onDelete(id): function
 * - page, pages: numbers (optional)
 * - onPrevPage(), onNextPage(): functions (optional)
 * - onSearch(q: string): function
 * - initialQuery: string
 */
export default function CustomerList({
  customers = [],
  onDelete,
  page,
  pages,
  onPrevPage,
  onNextPage,
  onSearch,
  initialQuery = "",
}) {
  const submit = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") || "";
    onSearch?.(q);
  };

  return (
    <div>
      <form onSubmit={submit} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input name="q" placeholder="Search name/phone" defaultValue={initialQuery} />
        <button type="submit">Search</button>
      </form>

      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead style={{ background: "#f4f4f4" }}>
          <tr>
            <th align="left">#</th>
            <th align="left">Name</th>
            <th align="left">Phone</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => {
            const first = c.first_name ?? c.firstName;
            const last = c.last_name ?? c.lastName;
            const phone = c.phone_number ?? c.phoneNumber;
            return (
              <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{c.id}</td>
                <td>{first} {last}</td>
                <td>{phone}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <Link to={`/customers/${c.id}`}>View</Link>
                  <Link to={`/customers/${c.id}/edit`}>Edit</Link>
                  <button onClick={() => onDelete?.(c.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
          {!customers.length && (
            <tr><td colSpan="4">No customers found.</td></tr>
          )}
        </tbody>
      </table>

      {(page && pages) && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button disabled={page <= 1} onClick={onPrevPage}>Prev</button>
          <span>Page {page} / {pages}</span>
          <button disabled={page >= pages} onClick={onNextPage}>Next</button>
        </div>
      )}
    </div>
  );
}
