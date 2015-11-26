var mongoose = require('mongoose');

var options = {
	timestamps: true
}

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

//property  createdAt and updatedAt
var paperSchema = new mongoose.Schema({
		title: {
			type: String,
			trim: true,
			required: true
		},
		author: {
			type: String,
			trim: true,
			required: true
		},
		body: {
			type: String,
			trim: true,
			required: true
		},
		date: {
			type: Date,
			default: new Date()
		},
		comments: [commentSchema]
}, options);

//Query#findOne([criteria], [projection], [callback])
paperSchema.statics.findOneBy = function(field, value, callback) {
	return this.findOne({field: value}, callback);
}

//Mongoose#model(name, [schema], [collection], [skipInit])
var Paper = mongoose.model('Paper', paperSchema, 'paper');
	
module.exports = Paper;


