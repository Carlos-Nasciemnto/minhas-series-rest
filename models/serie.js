const mongoose = require('mongoose')
const CommentSchema = mongoose.Schema({
    comments: String
})

const SerieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enumValues: [ 'to-watch', 'watching', 'watched' ]
    },
    Comments:[CommentSchema] 
})
const Serie = mongoose.model('Serie', SerieSchema)

module.exports = Serie