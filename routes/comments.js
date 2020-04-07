var express = require("express");
var router  = express.Router();
var mongoose = require("mongoose");

var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS ROUTES

router.get("/blogs/:id/comments/new",middleware.isLoggedIn,function(req,res){
	//find campground by id
	var id =  mongoose.Types.ObjectId(req.params.id);
	Blog.findById(id,function(err,blog){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{blog:blog});
		}
	}) 
	
})

router.post("/blogs/:id/comments",middleware.isLoggedIn,function(req,res){
	// find campground by id
	var id =  mongoose.Types.ObjectId(req.params.id);
	Blog.findById(id,function(err,blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong")
					console.log(err);
				}else{
//we'll get here inly if its logged in so, req.user contain our user					
					//add username n id to comment
					comment["author"]["id"]=req.user._id;
					comment["author"]["username"]=req.user.username;
					//save comment
					comment.save();
					blog.comments.push(comment);
					blog.save();
					req.flash("success","Successfully added comment");
					res.redirect("/blogs/"+id);
				}
			});
			
		}
	})
});

//edit route
router.get("/blogs/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	
	var blog_id =  mongoose.Types.ObjectId(req.params.id);
	var id =  mongoose.Types.ObjectId(req.params.comment_id);
	
// someone can change the camp id in the url and broke our app so 
	Blog.findById(blog_id,function(err,foundBlog){
		if(err || !foundBlog){
			req.flash("error","Blog not found");
			return res.redirect("back");
		}
		//error handling is done now
		
		Comment.findById(id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}else{
	res.render("comments/edit",{blog_id:blog_id,comment:foundComment});
		}
	})
});
	});
	
	
//Comment UPDATE Route
router.put("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	var id =  mongoose.Types.ObjectId(req.params.comment_id);
	var id2 =  mongoose.Types.ObjectId(req.params.id);
	Comment.findByIdAndUpdate(id,req.body.comment,function(err,updatedComment){	
	if(err){
		res.redirect("back");
	}else{
		res.redirect("/blogs/"+id2);
	}
	     })
	
});
//DELETE COMMENT Route
router.delete("/blogs/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
	var id =  mongoose.Types.ObjectId(req.params.comment_id);
	var id2 =  mongoose.Types.ObjectId(req.params.id);
	
	 Comment.findByIdAndRemove(id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/blogs/" + id2);
       }
    });
});

module.exports= router;