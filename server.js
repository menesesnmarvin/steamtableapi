require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(cors());
app.use(express.json())

const pressureRouter = require('./routes/pressure')
const temperatureRouter = require('./routes/temperature')

app.use('/pressure', pressureRouter)
app.use('/temperature', temperatureRouter)

app.listen(5000, () => console.log("Server Started"))