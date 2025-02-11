const Listing = require("../models/listing.js");
module.exports.index = async (req,res)=>{
    let query = req.query.q || "";
    let search = req.query.search || "";
    let allListings;
    if(query){
        allListings = await Listing.find({ type: query }); 
    } else if(search){
        allListings = await Listing.find({title: { $regex: search, $options: "i" }});
    } else{
        allListings = await Listing.find({}); 
    }
    res.render("listings/index.ejs",{allListings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};
module.exports.showListing = async (req,res)=>{
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
};
module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let fileName = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,fileName};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};
module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing does not exists");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload','/upload/w_250');
    res.render("listings/edit.ejs",{listing,originalImageUrl});  
};
module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let fileName = req.file.filename;
        listing.image = {url,fileName};
        listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Delted!");
    res.redirect("/listings");
}