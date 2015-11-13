var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
		name: {
			type: String,
			trim: true,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		email: {
			type: String,
			match: /.+\@.+\..+/,
			lowercase: true
		},
		date: {
			type: Date,
			default: new Date()
		}
});

//Query#findOne([criteria], [projection], [callback])
userSchema.statics.findOneBy = function(field, value, callback) {
	return this.findOne({field: value}, callback);
}

//Mongoose#model(name, [schema], [collection], [skipInit])
var User = mongoose.model('User', userSchema, 'user');
	
module.exports = User;


