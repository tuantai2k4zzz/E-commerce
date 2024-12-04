const express = require('express')
const dbConnect = require('./config/dbconnect')
require('dotenv').config()
const initRoutes = require("./routes")
const cookieParser = require("cookie-parser")

const app = express()
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({extended: true}))
initRoutes(app)
dbConnect()
app.use('/', (req, res) => {res.send('SERVER ON!')})


app.listen(port, () => {
    console.log('Server running on the port:' + port)
})