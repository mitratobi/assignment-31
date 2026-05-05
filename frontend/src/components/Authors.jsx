import { useState, useEffect } from 'react'

const API = '/api/authors'

export default function Authors() {
  const [authors, setAuthors] = useState([])
  const [form, setForm] = useState({ name: '', email: '' })
  const [editing, setEditing] = useState(null)

  const load = () => fetch(API).then(r => r.json()).then(setAuthors)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (editing) {
      await fetch(`${API}/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setEditing(null)
    } else {
      await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setForm({ name: '', email: '' })
    load()
  }

  const del = async (id) => { await fetch(`${API}/${id}`, { method: 'DELETE' }); load() }
  const edit = (a) => { setEditing(a._id); setForm({ name: a.name, email: a.email }) }
  const cancel = () => { setEditing(null); setForm({ name: '', email: '' }) }

  return (
    <div>
      <h2>Authors <span style={badge}>One-to-Many → Books</span></h2>
      <p style={{ color: '#666' }}>One author can write many books. The Book stores a reference to its Author.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inp} />
        <button onClick={save} style={btnGreen}>{editing ? 'Update' : 'Add Author'}</button>
        {editing && <button onClick={cancel} style={btnGray}>Cancel</button>}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map(a => (
            <tr key={a._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}>{a.name}</td>
              <td style={td}>{a.email}</td>
              <td style={td}>
                <button onClick={() => edit(a)} style={btnYellow}>Edit</button>
                <button onClick={() => del(a._id)} style={btnRed}>Delete</button>
              </td>
            </tr>
          ))}
          {authors.length === 0 && <tr><td colSpan={3} style={{ ...td, color: '#aaa', textAlign: 'center' }}>No authors yet</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

const inp = { padding: '7px 10px', border: '1px solid #ccc', borderRadius: 4, flex: 1, minWidth: 160 }
const btnGreen  = { padding: '7px 16px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const btnGray   = { padding: '7px 16px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const btnYellow = { padding: '5px 12px', background: '#f39c12', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 6 }
const btnRed    = { padding: '5px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const th = { padding: '9px 12px', textAlign: 'left', fontWeight: 'bold' }
const td = { padding: '9px 12px' }
const badge = { fontSize: 12, background: '#d5f5e3', color: '#1e8449', padding: '2px 8px', borderRadius: 10, marginLeft: 8, fontWeight: 'normal' }
