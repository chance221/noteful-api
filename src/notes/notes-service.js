const NotesService = {

  getAllNotes(knex) {
    return knex.select('*').from('notes')
  },

  insertNotes(knex, newNote){
    return knex
    .insert(newNote)
    .into('notes')
    .returning('*')
  },

  getById(knex, id){
    return knex('notes')
    .select('*')
    .where({id}).first()
  },

  deleteNotes(knex, id){
    return knex('notes')
    .where({id})
    .delete()
  },

  updateNotes(knex, id, newNoteFields){
    return knex('notes')
    .where({id})
    .update(newNoteFields)
  }

}

module.exports = NotesService