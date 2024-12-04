const express = require('express')
const dbConnect = require('./config/dbconnect')
require('dotenv').config()
const initRoutes = require("./routes")
const cookieParser = require("cookie-parser")
const cors = require('cors');

const app = express()
const port = process.env.PORT || 8888
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(cors({
    origin: 'http://your-client-domain.com', // Chỉnh sửa URL của bạn
    credentials: true // Cho phép gửi cookie
  }));
initRoutes(app)
dbConnect()
app.use('/', (req, res) => {res.send('SERVER ON!')})


app.listen(port, () => {
    console.log('Server running on the port:' + port)
})