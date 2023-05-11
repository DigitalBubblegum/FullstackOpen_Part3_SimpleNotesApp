const express = require('express')
const app = express()
const cors = require("cors");
const mongoose = require('mongoose')
//DO NOT SAVE YOUR PASSWORD TO GITHUB
const password = process.argv[2];
const url = `mongodb+srv://ghoshaldiwakar:${password}@learningcluster0.yrx0i94.mongodb.net/noteApp?retryWrites=true&w=majority`;
mongoose.set('strictQuery',false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Note = mongoose.model('Note',noteSchema)
app.use(cors());
app.use(express.json())
app.use(express.static("build"));
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get('/',(request,response)=>{
  response.send('<h1>hello world</h1>')
})
app.get("/new", (request, response) => {
  response.send("<h1>hello new</h1>");
});
app.get('/api/notes',(request,response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
})
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).send("<h1>404 not found</h1>").end();
  }
});
app.delete('/api/notes/:id',(request,response)=>{
  const id = Number(request.params.id)
  notes.filter(note=>note.id!=id)
  response.status(204).end()
  console.log('deleted');
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//end