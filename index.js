require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// test server
app.get('/', (req, res) => {
  res.json({
    status: 'SHOP ACC ONLINE',
    uuid_test: uuidv4()
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})
app.use("/shop", require("./routes/shop"));
