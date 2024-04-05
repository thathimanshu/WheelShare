const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

const mongoose_url = 'mongodb://127.0.0.1:27017/wonderlust'
async function main(){
    await mongoose.connect(mongoose_url);
}
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj,owner:"660eeb9501b6a643c8df2cca"}));
    await Listing.insertMany(initData.data);
    console.log("Data was Initialised");
}
initDB();