const express = require("express");
const router = express.Router();

const Room = require("../models/room");



router.get("/", async (req, res) => {
	const rooms = await Room.find();
	console.log(rooms);
	res.json(rooms);

});


router.put("/:id", async (req, res) => {
	const {type, occupied} = req.body;
	const roomModel = {type, occupied};
	await Room.findByIdAndUpdate(req.params.id, roomModel);
	console.log(roomModel);
	res.json("Room Updated");

});


module.exports = router;