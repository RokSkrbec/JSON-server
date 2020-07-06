// requires
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config')

const app = express()

// import routes
const jsonRoute = require("./routes/json")

// middlewares
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())
app.use("/api/json", jsonRoute)

const port = process.env.PORT || 3333

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
}).on('error', (err) => {
  console.log(err);
})