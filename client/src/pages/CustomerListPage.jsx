import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getCustomers, deleteCustomer } from "../api";

export default function CustomerListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 1);
  const q = sp.get("q") || "";

  useEffect(() => {
    setLoading(true);
    getCustomers({ page, limit: 10, q })
      .then(r => {
        const body = r.data;
        setRows(body.data || []);
        if (body.pagination) setPagination(body.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, q]);

  const onSearch = (e) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q") || "";
    setSp({ q: query, page: "1" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this customer?")) return;
    await deleteCustomer(id);
    const r = await getCustomers({ page, limit: 10, q });
    setRows(r.data.data || []);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input name="q" placeholder="Search name/phone" defaultValue={q} />
        <button>Search</button>
        <button type="button" onClick={() => setSp({ page: "1" })}>Clear</button>
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
          {rows.map(c => (
            <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{c.id}</td>
              <td>{(c.first_name ?? c.firstName) + " " + (c.last_name ?? c.lastName)}</td>
              <td>{c.phone_number ?? c.phoneNumber}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link to={`/customers/${c.id}`}>View</Link>
                <Link to={`/customers/${c.id}/edit`}>Edit</Link>
                <button onClick={() => remove(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan="4">No customers</td></tr>}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button disabled={page<=1} onClick={() => setSp({ q, page: String(page-1) })}>Prev</button>
        <span>Page {page} / {pagination.pages || 1}</span>
        <button disabled={pagination.pages && page>=pagination.pages}
                onClick={() => setSp({ q, page: String(page+1) })}>
          Next
        </button>
      </div>
    </div>
  );
}
