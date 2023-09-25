const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
//Token related shenanis
const getTokenFrom = request => {

	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '')
	}
	return null
}
//add notes to DB

notesRouter.post('/', async (request, response) => {
	const body = request.body
	const decodedToken = jwt.verify(getTokenFrom(request),process.env.SECRET)
	if(!decodedToken.id){
		return response.status(401).json({ error:'token invalid' })
	}
	// const user = await User.findById(body.user)
	const user = await User.findById(decodedToken.id)


	if (body.content === undefined) {
		return response.status(400).json({
			error: 'content missing',
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important === undefined ? false : body.important,
		user: user.id
	})
	const savedNote = await note.save()
	user.notes = user.notes.concat(savedNote._id)
	await user.save()
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