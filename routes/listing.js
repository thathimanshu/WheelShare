const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js');


//index route
router.get("/",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});
//Show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{
            path:"author"
        }
        })
      .populate("owner");
    
    if(!listing){
        req.flash("error","Listing does not exists");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));


//Create route
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}) );

//Edit route
router.get("/:id/edit",isLoggedIn,async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing does not exists");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});  
});
//Update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success","Listing Delted!");
    res.redirect("/listings");
}));

module.exports = router;