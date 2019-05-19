const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/myDB')
        .then(() => {console.log('Mongodb connectting')})
        .catch(err => {console.log(err)})

