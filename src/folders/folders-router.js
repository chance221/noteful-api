const express = require('express')
const FoldersService = require('./folders-service')
const uuid = require('uuid/v4')
const foldersRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')

const sanitizeFolder = folder =>({
  id: folder.id,
  name: xss(folder.name),
})

foldersRouter
  .route('/')
  .get((req, res, next) =>{
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
    .then(folders=> {
      res.json(folders.map(sanitizeFolder))
    })
    .catch(next)
  })
  .post(jsonParser, (req, res, next) =>{
  
    const {name} = req.body
    const id = uuid().toString()
    const newFolder = {name, id}
    const knexInstance = req.app.get('db')

    for(const [key, value] of Object.entries(newFolder)){
      if (value == null) {
        return res.status(400).json({
          error: {message: `Missing ${key} in request body`}
        })
      }
    }
  
    FoldersService.insertFolders(knexInstance, newFolder)
      .then(folder =>{
        res.status(201)
        .json(sanitizeFolder(folder))
      })
      .catch(next)
  })

foldersRouter
  .route('/:id')
  .get((req, res, next)=> {
    const knexInstance = req.app.get('db')
    FoldersService.getById(knexInstance, req.params.id)
    .then(folder =>{
      res.json(sanitizeFolder(folder))
    })
    .catch(next)
  })
  .delete((req, res, next) =>{
    FoldersService.deleteFolders(req.app.get('db'), req.params.id)
    .then(()=>{
      res.status(204).end()
    })
    .catch(next)
  })
  .patch(jsonParser, (req, res, next)=>{

    const {name} = req.body
    const folderToUpdate = {name}

    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.id,
      folderToUpdate
    )
      .then(numRowsAffected =>{
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = foldersRouter

    