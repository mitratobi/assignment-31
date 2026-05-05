import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Tags from './components/Tags'

export default function App() {
  const [tab, setTab] = useState('books')

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 4 }}>Library Manager</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: 20 }}>
        <strong>One-to-Many:</strong> Author → Books &nbsp;|&nbsp;
        <strong>Many-to-Many:</strong> Books ↔ Tags
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['authors', 'books', 'tags'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 22px',
            background: tab === t ? '#2c3e50' : '#ecf0f1',
            color: tab === t ? '#fff' : '#333',
            border: 'none', borderRadius: 4, cursor: 'pointer',
            textTransform: 'capitalize', fontWeight: tab === t ? 'bold' : 'normal'
          }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'authors' && <Authors />}
      {tab === 'books'   && <Books />}
      {tab === 'tags'    && <Tags />}
    </div>
  )
}
