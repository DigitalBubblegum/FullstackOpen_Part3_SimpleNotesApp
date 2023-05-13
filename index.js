require('dotenv').config()
const express = require('express')
const app = express()
const cors = require("cors");
const Note = require("./models/note");
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

  if (body.content===undefined) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
   response.json(savedNote);
   console.log('saved note to db');
  })
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
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).end();
    });
  
});
app.delete('/api/notes/:id',(request,response)=>{
  const id = Number(request.params.id)
  notes.filter(note=>note.id!=id)
  response.status(204).end()
  console.log('deleted');
})
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//end