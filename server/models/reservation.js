const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReservationSchema = new Schema({
	guestName: {type: String, required: true},
	idGuest: {type: String, required: false },
	roomNumber: {type: Number, required: true},
	dateCheckIn: {type: Date, required: true },
	dateCheckOut: {type: Date, required: true }

});


module.exports = mongoose.model("Reservation", ReservationSchema);