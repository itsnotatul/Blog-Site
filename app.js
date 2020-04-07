var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	passport      = require("passport"),
	flash         = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride= require("method-override"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment"),
	User          = require("./models/user"),
expressSantitzer  = require("express-sanitizer")	
	
//requiring routes
var commentRoutes    = require("./routes/comments"),
	blogRoutes = require("./routes/blogs"),
	indexRoutes      = require("./routes/index");
    
   var url = process.env.DATABASEURL ||  "mongodb://localhost/restful_blog_app"
mongoose.connect(url,{
	useNewUrlParser:true,
	useCreateIndex:true
});
    
//APP CONFIG
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSantitzer());
app.use(methodOverride("_method"))
app.use(flash());



//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"rusty is the best dog in the world",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());//decode the password 

// this'll call this functn on every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;//req.user will either contain da user or not
	res.locals.error       = req.flash("error");
	res.locals.success     = req.flash("success");
	
	next(); // as it is a middleware on every route.
	// all it does is ,that is passes req.user as variable currentUser on every route
})


app.use(commentRoutes);
app.use(blogRoutes);
app.use(indexRoutes);










const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BlogSite server is listening now on ${ PORT }`);
});



