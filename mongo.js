const mongoose = require('mongoose')

if (process.argv.length<3) {
	console.log('give password as argument')
	process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ghoshaldiwakar:${password}@learningcluster0.yrx0i94.mongodb.net/noteAppTest?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean,
})

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		return returnedObject
	},
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
	content: 'JS is Easy',
	important: true,
})

// eslint-disable-next-line no-unused-vars
note.save().then(result => {
	console.log('note saved!')
	mongoose.connection.close()
})
Note.find({}).then((result) => {
	result.forEach((note) => {
		console.log(note)
	})
	mongoose.connection.close()
})
