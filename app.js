const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')
const errorHandler = (error, _request, response, next) => {
	console.log(error.message)
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}
const unknownEndpoint = (_request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//add notes to DB
app.post('/api/notes', (request, response, next) => {
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

	note
		.save()
		.then((savedNote) => {
			response.json(savedNote)
			console.log('saved note to db')
		})
		.catch((error) => next(error))
})
//testing api
app.get('/', (_request, response) => {
	response.send('<h1>hello world</h1>')
})
//testing api 2
app.get('/new', (_request, response) => {
	response.send('<h1>hello new</h1>')
})
//get all from DB
app.get('/api/notes', (_request, response) => {
	Note.find({}).then((notes) => {
		response.json(notes)
	})
})
//get by ID
app.get('/api/notes/:id', (request, response, next) => {
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
app.delete('/api/notes/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then((result) => {
			console.log(result.message)
			response.status(204).end()
		})
		.catch((error) => next(error))
})
//updating the value of importance of note in DB
app.put('/api/notes/:id', (request, response, next) => {
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
app.use(unknownEndpoint)
app.use(errorHandler)
module.exports = app
//end