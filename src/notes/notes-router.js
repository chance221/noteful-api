const express = require('express')
const NotesService = require('./notes-service')
const notesRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')

notesRouter
  .route('/')
  .get((req, res, next) =>{
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
    .then(notes => {
      res.json(notes)
    })
    .catch(next)
  })
  //need to fix this as it is saying that one of the constraints is not found
  .post(jsonParser, (req, res, next) =>{
    
    let {name, folderId, content} = req.body
    folderId = parseInt(folderId, 10)
    
    const newNote = {name, folderId, content}
    const knexInstance = req.app.get('db')

    for(const [key, value] of Object.entries(newNote)){
      if (value == null) {
        return res.status(400).json({
          error: {message: `Missing ${key} in request body`}
        })
      }
    }
  
    NotesService.insertNotes(knexInstance, newNote)
      .then (note =>{
        res
          .status(201)
          .json(note)
      })
      .catch(next)
  })

notesRouter
  .route('/:id')
  .get((req, res, next)=> {
    const knexInstance = req.app.get('db')
    NotesService.getById(knexInstance, req.params.id)
    .then(note =>{
      res.json(note)
    })
    .catch(next)
  })
  .delete((req, res, next) =>{
    NotesService.deleteNotes(req.app.get('db'), req.params.id)
      .then (()=>{
        res.status(204).end()
      })
      .then(next)
  })
  .put(jsonParser, (req, res, next)=>{
    let {name, folderId, content} = req.body
    folderId = parseInt(folderId, 10)
    const noteToUpdate = {name, folderId, content}

    NotesService.updateNotes(
      req.app.get('db'), 
      req.params.id, 
      noteToUpdate
      )
        .then(numRowsAffected =>{
          res.status(204).json(numRowsAffected).end()
        })
        .catch(next)
  })


  module.exports = notesRouter
  
  


