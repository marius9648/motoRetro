var Campground = require("./models/campground"),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	express    = require("express"),
	app        = express(),
	Comment    = require("./models/comment"),
 	seedDB	   = require("./seeds"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	flash			= require("connect-flash")

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")
						  

//seedDB(); //seed the database

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://marius9648:191996marius@cluster0-mbgrz.mongodb.net/test?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


app.use(methodOverride("_method"));
app.use(flash());


// Passport configuration
app.use(require("express-session")({
		secret: "This is a secret",
		resave: false,
		saveUninitialized: false
		}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//requiring routes
app.use("/motoretro/:id/comments", commentRoutes);
app.use("/motoretro", campgroundRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP);





