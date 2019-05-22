const express = require('express')
require('./db/connect')
const app = express()
const bodyParser = require('body-parser')
const user = require('./routes/api/user')
const profile = require('./routes/api/profile')

const port = process.env.POST || 3000
const passport = require('passport')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// passport引入
app.use(passport.initialize())
require("./config/passport")(passport)

app.use('/api/user', user)
app.use('/api/profile', profile)

app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})