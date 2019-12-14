var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res){
	res.render("landing", {currentUser:req.user});
});

//=============
//Auth routes
//=============
router.get("/register", function(req, res){
	res.render("register", {currentUser:req.user});
});

//handle signup logic
router.post("/register", middleware.passwordMatch, function(req, res){
	var newUser = ({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
			passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to MotoRETRO, " + user.username);
			res.redirect("/motoretro");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login", {currentUser:req.user});
});

//handling login logic
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/motoretro",
		failureRedirect: "/login",
		failureFlash: "Wrong username or password" 
	}), function(req, res){
	req.flash("success", "Logged in as " + req.user.username);
});
	
//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged out");
	res.redirect("/motoretro");
});


module.exports = router;
