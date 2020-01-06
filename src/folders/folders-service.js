
const FoldersService = {
  
  getAllFolders(knex) {
    return knex.select('*').from('folders')
  },

  insertFolders(knex, newFolder){
    return knex
      .insert(newFolder)
      .into('folders')
      .returning('*')
  },

  getById(knex, id){
    return knex('folders')
    .select('*')
    .where({id}).first()
  },

  deleteFolders(knex, id) {
    return knex('folders')
    .where({id})
    .delete()
  },

  updateFolder(knex, id, newFolderFields) {
    return knex('folders')
    .where({id})
    .update(newFolderFields)
  }
  
}


module.exports = FoldersService