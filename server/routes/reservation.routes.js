const express = require("express");
const router = express.Router();

const Reservation = require("../models/reservation");




//router.get("/", async (req, res) => {
//	const rooms = await Room.find();
//	console.log(rooms);
//	res.json(rooms);

//});


router.post("/", async (req, res) => {
	const {guestName,
	idGuest,
	roomNumber,
	dateCheckIn,
	dateCheckOut} = req.body;
	const reservation = new Reservation({
		guestName,
		idGuest,
		roomNumber,
		dateCheckIn,
		dateCheckOut
	});
	await reservation.save();
	console.log(reservation);
	res.json("saved");

});


module.exports = router;