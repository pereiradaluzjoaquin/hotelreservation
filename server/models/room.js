const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoomSchema = new Schema({
	type: {type: String, required: true},
	occupied: {type: String, required: true }

});


module.exports = mongoose.model("Room", RoomSchema);