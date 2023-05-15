const express = require('express')
const app = express()
const cors = require("cors");
require('dotenv').config()
const Note = require("./models/note");
const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if(error.name === 'CastError'){
    return response.status(400).send({error:'malformatted id'})
  }
  next(error)  
}
const unknownEndpoint = (request,response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(cors());
app.use(express.json())
app.use(express.static("build"));


const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};
//add notes to DB
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
//testing api 
app.get('/',(request,response)=>{
  response.send('<h1>hello world</h1>')
})
//testing api 2
app.get("/new", (request, response) => {
  response.send("<h1>hello new</h1>");
});
//get all from DB
app.get('/api/notes',(request,response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
})
//get by ID
app.get("/api/notes/:id", (request, response,next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  
});
//delete from DB
app.delete('/api/notes/:id',(request,response)=>{
  const id = Number(request.params.id)
  notes.filter(note=>note.id!=id)
  response.status(204).end()
  console.log('deleted');
})
app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
//end