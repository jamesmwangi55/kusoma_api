var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var resourceModel = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    course: {
        type: Schema.ObjectId,
        ref: 'Course'
    },
    university: {
        type: Schema.ObjectId,
        ref: 'University'
    },
    created: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Resource', resourceModel);