var express = require("express"),
	path = require("path"),
	bodyParser = require("body-parser"),
	app = express();

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "./static")));

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

var server = app.listen(8000, function(){
	console.log("Listening on port 8000!");
});

var route = require("./routes/index.js")(app, server);