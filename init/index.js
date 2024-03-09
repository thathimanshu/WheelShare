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
    await Listing.insertMany(initData.data);
    console.log("Data was Initialised");
}
initDB();