const notesRouter = require('express').Router()
const Note = require('../models/note')

//add notes to DB
notesRouter.post('/', async (request, response, next) => {
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
	try {
		const savedNote = await note.save()
		response.status(201).json(savedNote)
	} catch (exception ){
		next(exception)
	}
})
//get all from DB
notesRouter.get('/', async (request, response) => {
	const notes = await Note.find({})
	response.json(notes)
})
//get by ID
notesRouter.get('/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})
//delete from DB
notesRouter.delete('/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then((result) => {
			console.log(result.message)
			response.status(204).end()
		})
		.catch((error) => next(error))
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