var mongoose = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Schema setup
var blogSchema = new mongoose.Schema({
	title: String, 
	image : String,
	description:String,
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