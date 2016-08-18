var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var courseModel = new Schema({
    code: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    university: {
        type: Schema.ObjectId,
        ref: 'University'
    },
    created: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Course', courseModel);