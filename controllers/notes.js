const notesRouter = require('express').Router()
const Note = require('../models/note')

//add notes to DB
notesRouter.post('/', async (request, response) => {
	const body = request.body

	if (body.content === undefined) {
		return response.status(400).json({
			error: 'content missing',
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	})
	const savedNote = await note.save()
	response.status(201).json(savedNote)
})
//get all from DB
notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({})
	response.json(notes)
})
//get by ID
notesRouter.get('/:id', async (request, response) => {
	const note = await Note.findById(request.params.id)
	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
})
//delete from DB
notesRouter.delete('/:id', async (request, response) => {
	await Note.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

//updating the value of importance of note in DB
notesRouter.put('/:id', (request, response, next) => {
	const { content, important } = request.body
	Note.findByIdAndUpdate(
		request.params.id,
		{ content, important },
		{ new: true, runValidators: true, context: 'query' }
	)
		.then((updatedNote) => {
			console.log('modified')
			response.json(updatedNote)
		})
		.catch((error) => next(error))
})
module.exports = notesRouter