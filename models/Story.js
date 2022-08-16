const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default:'public',
        enum: ['public','private']
    },
    user: {
        //Identify using the users ID not the users name
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
   
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Story', StorySchema)