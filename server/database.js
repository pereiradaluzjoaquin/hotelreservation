const mongoose = require("mongoose");
const URI = "mongodb://localhost:27017/HotelNodeJs";
mongoose.connect(URI)
	.then(db => console.log("db is connected"))
	.catch(error => console.error(error));
module.exports = mongoose;	
