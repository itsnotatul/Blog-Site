var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
	mongoose   = require("mongoose"),
	express    = require("express"),
expressSantitzer= require("express-sanitizer"),	
	app        = express();

//APP CONFIG
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSantitzer());
app.use(methodOverride("_method"))

//MONGOOSE MODEL CONFIG
var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type:Date , default: Date.now}
});

var Blog= mongoose.model("Blog",blogSchema);


//RESTFUL ROUTES

app.get("/",function(req,res){
	res.redirect("/blogs");
})

//INDEX
app.get("/blogs",function(req,res){
		Blog.find({},function(err,blogs){
			if(err){
				console.log("ERROR!");
			}else{
				res.render("index",{blogs:blogs});
			}
		});
});

//NEW route
app.get("/blogs/new",function(req,res){
	res.render("new");
})

//CREATE Route
app.post("/blogs",function(req,res){
	//sanitize the body(content of blog) coming from the form under blog so that no //script tags are used 
	req.body.blog.body=req.sanitize(req.body.blog.body);
	
	//create blog
	Blog.create(req.body.blog,function(err,newBlog){ // we stored body,img,tit in blog //systematically , so req.body.blogs automaticaly gets all three.
		if(err){
			res.render("new");
		}else{
			//redirect backto index
			res.redirect("/blogs");
		}
	});
});

//SHOW Route
app.get("/blogs/:id",function(req,res){
var id = mongoose.Types.ObjectId(req.params.id); 
	Blog.findById(id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	});
});

//EDIT Route
app.get("/blogs/:id/edit",function(req,res){
	var id = mongoose.Types.ObjectId(req.params.id);
	Blog.findById(id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

//UPDATE Route
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	var id= mongoose.Types.ObjectId(req.params.id);
	Blog.findByIdAndUpdate(id,req.body.blog,function(err,updatedForm){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+id);
		}
	});
	
});

//DELET Route
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	var id = mongoose.Types.ObjectId(req.params.id);
	Blog.findByIdAndRemove(id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});





app.listen(3000,function(){
	console.log("Restful Blog app is listening now.");
})


