var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	body: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: new Date()
	}
});

var postSchema = new mongoose.Schema({
		title: {
			type: String,
			trim: true,
			required: true
		},
		author: {
			type: String,
			required: true
		},
		body: {
			type: String,
			required: true
		},
		date: {
			type: Date,
			default: new Date()
		},
		comments: [commentSchema]
});

//Query#findOne([criteria], [projection], [callback])
postSchema.statics.findOneBy = function(field, value, callback) {
	return this.findOne({field: value}, callback);
}

//Mongoose#model(name, [schema], [collection], [skipInit])
var Post = mongoose.model('Post', postSchema, 'post');
	
module.exports = Post;


