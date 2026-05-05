import { useState, useEffect } from 'react'

const API = '/api/books'

export default function Books() {
  const [books, setBooks] = useState([])
  const [authors, setAuthors] = useState([])
  const [tags, setTags] = useState([])
  const [form, setForm] = useState({ title: '', year: '', author: '', tags: [] })
  const [editing, setEditing] = useState(null)

  const load = () => {
    fetch(API).then(r => r.json()).then(setBooks)
    fetch('/api/authors').then(r => r.json()).then(setAuthors)
    fetch('/api/tags').then(r => r.json()).then(setTags)
  }
  useEffect(() => { load() }, [])

  const toggleTag = (id) =>
    setForm(f => ({ ...f, tags: f.tags.includes(id) ? f.tags.filter(t => t !== id) : [...f.tags, id] }))

  const save = async () => {
    const body = { ...form, year: Number(form.year) }
    if (editing) {
      await fetch(`${API}/${editing}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setEditing(null)
    } else {
      await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setForm({ title: '', year: '', author: '', tags: [] })
    load()
  }

  const del = async (id) => { await fetch(`${API}/${id}`, { method: 'DELETE' }); load() }

  const edit = (b) => {
    setEditing(b._id)
    setForm({ title: b.title, year: b.year || '', author: b.author?._id || '', tags: b.tags?.map(t => t._id) || [] })
  }

  const cancel = () => { setEditing(null); setForm({ title: '', year: '', author: '', tags: [] }) }

  return (
    <div>
      <h2>Books</h2>
      <p style={{ color: '#666' }}>
        <strong>One-to-Many:</strong> Each book has one author (ObjectId ref). &nbsp;
        <strong>Many-to-Many:</strong> Each book has multiple tags (array of ObjectId refs).
      </p>

      <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
          <input placeholder="Book title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ ...inp, flex: 2 }} />
          <input placeholder="Year" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} style={{ ...inp, width: 90 }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={label}>Author <span style={relBadge('green')}>One-to-Many</span></label>
          <select value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} style={{ ...inp, width: '100%', display: 'block' }}>
            <option value="">-- Select Author --</option>
            {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={label}>Tags <span style={relBadge('blue')}>Many-to-Many</span></label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tags.map(t => (
              <span key={t._id} onClick={() => toggleTag(t._id)} style={{
                padding: '4px 12px', borderRadius: 20, cursor: 'pointer', userSelect: 'none',
                background: form.tags.includes(t._id) ? '#2980b9' : '#dde',
                color: form.tags.includes(t._id) ? '#fff' : '#333'
              }}>
                {t.name}
              </span>
            ))}
            {tags.length === 0 && <span style={{ color: '#aaa', fontSize: 13 }}>Add tags first from the Tags tab</span>}
          </div>
        </div>

        <button onClick={save} style={btnGreen}>{editing ? 'Update Book' : 'Add Book'}</button>
        {editing && <button onClick={cancel} style={{ ...btnGray, marginLeft: 8 }}>Cancel</button>}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={th}>Title</th>
            <th style={th}>Year</th>
            <th style={th}>Author <span style={{ color: '#27ae60', fontSize: 11 }}>(1-to-M)</span></th>
            <th style={th}>Tags <span style={{ color: '#2980b9', fontSize: 11 }}>(M-to-M)</span></th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={td}><strong>{b.title}</strong></td>
              <td style={td}>{b.year || '—'}</td>
              <td style={td}>
                {b.author
                  ? <span style={{ background: '#d5f5e3', padding: '3px 9px', borderRadius: 10, fontSize: 13 }}>{b.author.name}</span>
                  : <span style={{ color: '#aaa' }}>—</span>}
              </td>
              <td style={td}>
                {b.tags?.length
                  ? b.tags.map(t => <span key={t._id} style={{ background: '#d6eaf8', padding: '3px 9px', borderRadius: 10, marginRight: 4, fontSize: 12 }}>{t.name}</span>)
                  : <span style={{ color: '#aaa' }}>—</span>}
              </td>
              <td style={td}>
                <button onClick={() => edit(b)} style={btnYellow}>Edit</button>
                <button onClick={() => del(b._id)} style={btnRed}>Delete</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && <tr><td colSpan={5} style={{ ...td, color: '#aaa', textAlign: 'center' }}>No books yet</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

const inp       = { padding: '7px 10px', border: '1px solid #ccc', borderRadius: 4, flex: 1 }
const label     = { display: 'block', fontWeight: 'bold', marginBottom: 6 }
const btnGreen  = { padding: '7px 18px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const btnGray   = { padding: '7px 18px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const btnYellow = { padding: '5px 12px', background: '#f39c12', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 6 }
const btnRed    = { padding: '5px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }
const th = { padding: '9px 12px', textAlign: 'left', fontWeight: 'bold' }
const td = { padding: '9px 12px' }
const relBadge = (c) => ({ fontSize: 11, background: c === 'green' ? '#d5f5e3' : '#d6eaf8', color: c === 'green' ? '#1e8449' : '#1a5276', padding: '2px 7px', borderRadius: 10, marginLeft: 6, fontWeight: 'normal' })
