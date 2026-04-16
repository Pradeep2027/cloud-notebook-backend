const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/cloud-notebook"

const connectToMongo = () => {
    mongoose.connect(mongoURL).then(() => console.log("Connected to Mongo successfully")).catch((e) => console.log(e.messsage));
}

module.exports = connectToMongo;