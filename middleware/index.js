//all middleware goes here
var middlewareObj ={};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground  not found");
			console.log("err");
			res.redirect("back");
		} else {
			//does the user own the camp?
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You do not have permission to do that");
				res.redirect("back");
			}	
		}
	});
		} else {
			req.flash("error", "You need to be logged in to do that")
			res.redirect("back");
		}
}


middlewareObj.checkCommentOwnership = function (req, res, next){
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Comment not found");
			res.redirect("back");
		} else {
			if(foundComment.author.id.equals(req.user._id)){
				next();
			} else {
				req.flash("error", "You do not have permission to do that");
				res.redirect("back");
			}	
		}
	});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login");
}

middlewareObj.passwordMatch = function(req, res, next){
	if(req.body.password === req.body.passwordConfirm) {
		return next();
	}
	req.flash("error", "Passwords doesn't match")
	res.redirect("/register");
}


module.exports = middlewareObj;