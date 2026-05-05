const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/librarydb'
mongoose.connect(uri)

const Author = require('./models/Author')
const Book = require('./models/Book')
const Tag = require('./models/Tag')

app.get('/api/authors', async (req, res) => {
  const data = await Author.find()
  res.json(data)
})
app.post('/api/authors', async (req, res) => {
  const a = await Author.create(req.body)
  res.json(a)
})
app.put('/api/authors/:id', async (req, res) => {
  const a = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(a)
})
app.delete('/api/authors/:id', async (req, res) => {
  await Author.findByIdAndDelete(req.params.id)
  res.json({ message: 'deleted' })
})

app.get('/api/books', async (req, res) => {
  const data = await Book.find().populate('author').populate('tags')
  res.json(data)
})
app.post('/api/books', async (req, res) => {
  const b = await Book.create(req.body)
  res.json(await b.populate(['author', 'tags']))
})
app.put('/api/books/:id', async (req, res) => {
  const b = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('author').populate('tags')
  res.json(b)
})
app.delete('/api/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id)
  res.json({ message: 'deleted' })
})

app.get('/api/tags', async (req, res) => {
  res.json(await Tag.find())
})
app.post('/api/tags', async (req, res) => {
  res.json(await Tag.create(req.body))
})
app.put('/api/tags/:id', async (req, res) => {
  res.json(await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})
app.delete('/api/tags/:id', async (req, res) => {
  await Tag.findByIdAndDelete(req.params.id)
  res.json({ message: 'deleted' })
})

app.listen(5000, () => console.log('server on 5000'))
