const mongoose = require('mongoose')

mongoose
    .connect('mongodb://mongodb101internet:27017/', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db