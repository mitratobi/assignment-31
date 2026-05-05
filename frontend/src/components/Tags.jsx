import { useState, useEffect } from 'react'

const API = '/api/tags'

export default function Tags() {
  const [tags, setTags] = useState([])
  const [form, setForm] = useState({ name: '' })
  const [editing, setEditing] = useState(null)

  const load = () => fetch(API).then(r => r.json()).then(setTags)
  useEffect(() => { load() }, [])

  const save = async () => {
    if (editing) {
      await fetch(`${API}/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setEditing(null)
    } else {
      await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setForm({ name: '' })
    load()
  }

  const del = async (id) => { await fetch(`${API}/${id}`, { method: 'DELETE' }); load() }
  const edit = (t) => { setEditing(t._id); setForm({ name: t.name }) }
  const cancel = () => { setEditing(null); setForm({ name: '' }) }

  return (
    <div>
      <h2>Tags <span style={badge}>Many-to-Many ↔ Books</span></h2>
      <p style={{ color: '#666' }}>A tag can belong to many books; a book can have many tags. Stored as an array of ObjectId references in Book.</p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <input placeholder="Tag name (e.g. Fiction, Science, History)" value={form.name} onChange={e => setForm({ name: e.target.value })} style={{ ...inp, flex: 2 }} />
        <button onClick={save} style={btnGreen}>{editing ? 'Update' : 'Add Tag'}</button>
        {editing && <button onClick={cancel} style={btnGray}>Cancel</button>}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {tags.map(t => (
          <div key={t._id} style={{ background: '#eaf4fd', padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>{t.name}</span>
            <button onClick={() => edit(t)} style={iconBtn('#f39c12')}>✏</button>
            <button onClick={() => del(t._id)} style={iconBtn('#e74c3c')}>✕</button>
          </div>
        ))}
        {tags.length === 0 && <p style={{ color: '#aaa' }}>No tags yet</p>}
      </div>
    </div>
  )
}

const inp = { padding: '7px 10px', border: '1px solid #ccc', borderRadius: 4, flex: 1 }
const btnGreen = { padding: '7px 16px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const btnGray  = { padding: '7px 16px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const iconBtn  = (color) => ({ background: 'none', border: 'none', cursor: 'pointer', color, fontWeight: 'bold', fontSize: 14, padding: 0 })
const badge = { fontSize: 12, background: '#d6eaf8', color: '#1a5276', padding: '2px 8px', borderRadius: 10, marginLeft: 8, fontWeight: 'normal' }
