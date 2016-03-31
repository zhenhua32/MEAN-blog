var mongoose = require('mongoose');

//add property  createdAt and updatedAt
var options = {
    timestamps: true
}

/**
 * model page represents  the real user's page
 * and validation
 * 
 * page.title
 * page.author
 * page.body
 * page.date
 * page.createdAt
 * page.updatedAt
 * page.comments
 */
var commentSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        match: /(\w)+/
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, options);

var pageSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    //ref 就是 _id, 用的是 mongodb 的 Manual References, 然后二次查询
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: mongoose.Schema.Types.Mixed,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    comments: [commentSchema]
}, options);


//Mongoose#model(name, [schema], [collection], [skipInit])
var Page = mongoose.model('Page', pageSchema, 'page');

//fancy constructors, new Page({}) return document
module.exports = Page;


