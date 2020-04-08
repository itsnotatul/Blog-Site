var mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var User = require("../models/user");
var Comment = require("../models/comment");

//Schema setup
var blogSchema = new mongoose.Schema({
	title: String, 
	image : String,
	body:String,
	created: {type:Date , default: Date.now},
	author:{
		id:{
		      type:mongoose.Schema.Types.ObjectId,
		      ref:"User"
		
	          },
	username:String
	},
	comments    :[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

module.exports = mongoose.model("Blog",blogSchema);