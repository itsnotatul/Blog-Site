var express = require("express");
var router  = express.Router();
var Blog = require("../models/blog");
var mongoose   = require("mongoose");
var middleware = require("../middleware");

//INDEX - show all blogs
router.get("/blogs",function(req,res){
		Blog.find({},function(err,blogs){
			if(err){
				console.log(err);
			}else{
				res.render("blogs/index",{blogs:blogs});
			}
		});
});

//NEW route
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
	res.render("blogs/new");
})

//CREATE Route
router.post("/blogs",middleware.isLoggedIn,function(req,res){
	//sanitize the body(content of blog) coming from the form under blog so that no //script tags are used 
	req.body.blog.body=req.sanitize(req.body.blog.body);
	var author={
				 id:req.user._id,
				username:req.user.username
			}

    var newBlog = {title: req.body.blog.title, image: req.body.blog.image, body: req.body.blog.body, created: req.body.blog.created, author:author};
	
	//create blog
	Blog.create(newBlog,function(err,newlyCreated){ // we stored body,img,tit in blog //systematically , so req.body.blogs automaticaly gets all three.
		if(err){
			res.render("new");
		}else{
			//redirect backto index
			res.redirect("/blogs");
		}
	});
});

// SHOW Route
router.get("/blogs/:id",function(req,res){
	var id = mongoose.Types.ObjectId(req.params.id); 
	Blog.findById(id).populate("comments").exec(function(err,foundBlog){
		if(err || !foundBlog){
        	req.flash("error","Blog not found");
			res.sendStatus(404);
			// res.redirect("back");
		}else{
			res.render("blogs/show",{blog:foundBlog});
		}
	});
});

//EDIT Route
router.get("/blogs/:id/edit",middleware.checkBlogOwnership,function(req,res){
	var id = mongoose.Types.ObjectId(req.params.id);
	Blog.findById(id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("blogs/edit",{blog:foundBlog});
		}
	});
});

//UPDATE Route
router.put("/blogs/:id",middleware.checkBlogOwnership,function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
	var id= mongoose.Types.ObjectId(req.params.id);
	Blog.findByIdAndUpdate(id,req.body.blog,function(err,updatedForm){
		if(err){
        	req.flash("error", err.message);
			res.redirect("/blogs");
		}else{
           req.flash("success","Successfully Updated!");
			res.redirect("/blogs/"+id);
		}
	});
	
});

//DELET Route
router.delete("/blogs/:id",middleware.checkBlogOwnership,function(req,res){
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

module.exports= router;