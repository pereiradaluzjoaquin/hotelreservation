const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const cors = require("cors");

const {mongoose} = require("./database");


//settings
app.set("port", 4000);

//middlewares|
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

//routes
app.use("/api/rooms", require("./routes/rooms.routes"));
app.use("/api/reservation", require("./routes/reservation.routes"));


//static files
app.use(express.static(path.join(__dirname, "public")));

app.listen(app.get("port"), () => {
	console.log(`server on port ${app.get("port")}`);


});