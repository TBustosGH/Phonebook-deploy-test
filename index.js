const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
morgan.token('PostData', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms /// :PostData'))

let phonebook = [
    {   "id": 1,  "name": "Arto Hellas",    "number": "040-123456"    },
    {   "id": 2,  "name": "Ada Lovelace",   "number": "39-44-5323523" },
    {   "id": 3,  "name": "Dan Abramov",    "number": "12-43-234345"  },
    {   "id": 4,  "name": "Mary Poppendieck",   "number": "39-23-6423122" }
]

//o

//GET: all the phonebook
app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})
//GET: just a person from the phonebook by it's ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)

    if (person)
        response.json(person)
    else
        response.status(404).end()
})

//GET: information from the API. How much persons it has in the phonebook & the actual date.
app.get('/info', (request, response) => {
    const amountOfPersons = phonebook.length
    const now = new Date()
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'September', 'August', 'October', 'November', 'December']

    response.send(
        `<div> 
            <h2>Phonebook has info for ${amountOfPersons} people</h2> 
            <br /> 
            <p>Today is 
                ${week[now.getDay() - 1]}, 
                ${months[now.getMonth()]}   ${now.getDate()}    ${now.getFullYear()}
            </p> 
            <p>Time:
                ${now.getHours()}/${now.getMinutes()}/${now.getSeconds()}
            </p>
        </div>`
    )
})


//DELETE: a person from the phonebook by it's ID
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const newPhonebook = phonebook.filter(person => person.id !==id)
    phonebook = newPhonebook

    response.status(204).end()
})


//POST: a person to the phonebook. name & number required!
app.post('/api/persons', (request, response) => {
    const body = request.body
    const min = 5, max = 999999999999

    //Error management
    if (!body)  //Checks if the request is empty
        return response.status(400).json({
            error: 'No request'
        })
    else if (!body.name)    //Checks if the request's name is empty
        return response.status(400).json({
            error: 'No name in request'
        })
    else if (!body.number)  //Checks if the request's number is empty
        return response.status(400).json({
            error: 'No number in request'
        })
    else if (phonebook.find(person => person.name === body.name))   //Checks if the request's name is already on the phonebook
        return response.status(400).json({
            error: 'Name is already added to the phonebook'
        })


    const person = {
        "id" : Math.floor(Math.random() * (max - min + 1)) + min,
        "name" : body.name,
        "number" : String(body.number)
    }
    //console.log('Person: ', person)
    phonebook = phonebook.concat(person)
    //console.log('Phonebook: ', phonebook)
    response.json(phonebook)
})


const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})