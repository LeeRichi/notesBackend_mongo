// const express = require('express')
// const app = express()
// const cors = require('cors')
// require('dotenv').config()
// const Note = require('./models/note')

// app.use(cors())
// app.use(express.json())

// app.use(express.static('dist'))

// app.get('/', (request, response) => {
//   response.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (request, response) => {
//   Note.find({}).then(notes => {
//     response.json(notes)
//   })
// })

// app.get('/api/notes/:id', (request, response, next) => {
//   Note.findById(request.params.id)
//     .then(note => {
//       if (note) {
//         response.json(note)
//       } else {
//         response.status(404).end()
//       }
//     })
//     .catch(error => next(error))
// })

// // const generateId = () => {
// //   const maxId = Note.length > 0
// //     ? Math.max(...Note.map(n => n.id))
// //     : 0
// //   return maxId + 1
// // }

// app.post('/api/notes', (request, response, next) => {
//   const body = request.body

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   })

//   note.save()
//     .then(savedNote => {
//       response.json(savedNote)
//     })

//     .catch(error => next(error))
// })

// app.delete('/api/notes/:id', (request, response, next) =>
// {
//   Note.findByIdAndDelete(request.params.id)
//     .then(result => {
//       response.status(204).end()
//       console.log(result)
//     })
//     .catch(error => next(error))
// })

// app.put('/api/notes/:id', (request, response, next) => {

//   const { content, important } = request.body

//   Note.findByIdAndUpdate(
//     request.params.id,
//     { content, important },
//     { new: true, runValidators: true, context: 'query' }
//   )
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })

// const errorHandler = (error, request, response, next) => {
//   console.error(error.message)

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message })
//   }

//   next(error)
// }
// app.use(errorHandler)

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }
// app.use(unknownEndpoint)

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app