if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbUrl = process.env.ATLASTDB_URL;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const usersRouter = require('./routes/user.js');

app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24*3600
});
store.on("error",()=>{
    console.log("Error in mongostore",err);
})
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires: Date.now() + 7*24*3600000,
        maxAge:7*24*3600000,
        httpOnly:true
    }
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

(async ()=>{
    await mongoose.connect(dbUrl);
})().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

app.listen(8080,()=>{
    console.log("App is Listening on port 8080");
});
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);
app.get("/",(req,res)=>{
    res.render('./home.ejs');
});
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
});