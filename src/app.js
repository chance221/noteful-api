require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common'

const notesRouter = require('./notes/notes-router')
const foldersRouter = require('./folders/folders-router')

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/notes', notesRouter)

app.use('/folders', foldersRouter)

app.get('/', (req, res)=>{
  res.send('Hello, world!')
})


module.exports = app