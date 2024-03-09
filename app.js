const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js");
const mongoose_url = 'mongodb://127.0.0.1:27017/wonderlust'
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);

async function main(){
    await mongoose.connect(mongoose_url);
}
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

app.listen(8080,()=>{
    console.log("App is Listening");
});

app.get('/',(req,res)=>{
    res.send("Root path");
});

//index route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

//New route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});
//Show route
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});
//Create route
app.post("/listings",async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});  
});
//Update route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete route
app.delete("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
});