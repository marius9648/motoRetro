var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/",function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var year = req.body.year;
	var newCampground = {name: name,
						image: image,
						description: desc,
						author: author,
						year: year}
	
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			req.flash("error", "Post not added. Try again")
			console.log(err);
		} else {
			req.flash("success", "Post added successfully");
			res.redirect("/motoretro");
			
		}
	});
	
});


router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new", {currentUser:req.user});
});

router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground, currentUser:req.user});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground:foundCampground, currentUser:req.user})
		}
	})
});

//UPDATE CAMPGROUND ROUTE

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, edited){
		if(err) {
			res.redirect("/motoretro");
		} else {
			res.redirect("/motoretro/" + req.params.id);
			req.flash("success", "Successfully edited post");
		}
	});
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, deleted){
		if(err){
			res.redirect("/motoretro");
		} else {
			req.flash("success", "Successfully deleted post");
			res.redirect("/motoretro");
			
		}
	});
});




module.exports = router;




