var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var universityModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: "University already exists"
    },
    created: {type: Date, default: Date.now}
})

module.exports = mongoose.model('University', universityModel);