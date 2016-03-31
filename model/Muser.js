var mongoose = require('mongoose');

//add property  createdAt and updatedAt
var options = {
    timestamps: true
}

/**
 * model user represents the real user
 * and validation
 * 
 * user.name
 * user.password
 * user.email
 * user.date
 * user.avatar
 * user.createdAt
 * user.updatedAt
 */
var userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 6,
        match: /(\w)+/,
        unique: true,
        required: true
    },
    //password minlength is 6, but not validate in here
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        match: /(\w)+@(\w)+\.(\w)+/,
        lowercase: true,
        unique: true,
        require: true
    },
    avatar: {
        type: String,
        match: /data:image\/png;base64,.+/
    },
    date: {
        type: Date,
        default: Date.now()
    },
    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }]
}, options);

//Instance methods
userSchema.methods.todo = function () {

}

//Statics methods
userSchema.statics.todo = function () {

}

//Mongoose#model(name, [schema], [collection], [skipInit])
var User = mongoose.model('User', userSchema, 'user');

//fancy constructors, new User({}) return document
module.exports = User;


