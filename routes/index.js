var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");
var mongoose = require("mongoose");

router.get("/",function(req,res){
	res.redirect("/blogs");
})

//AUTH ROUTE

//show register form
router.get("/register",function(req,res){
	res.render("register"); 
})

	//handle sign up logic
router.post("/register",function(req,res){
	var newUser = new User({username:req.body.username});
	
	User.register(newUser,req.body.password,function(err,user){
		if(err){	
			req.flash("error", err.message);
				return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to BlogSite " + user.username );
			res.redirect("/blogs");
		})
	})
})
	
//SHOW LOGIN FORM
router.get("/login",function(req,res){
	
	res.render("login");
})
	
//handling login logic
router.post("/login",passport.authenticate("local",{
	successRedirect: "/blogs",
	failureRedirect: "/login",
failureFlash: true // Enable flash messages
}),function(req,res){});

//LOGOUT 
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!");
	res.redirect("/blogs");
})




module.exports= router;