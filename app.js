//jshint esversion:6
const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const app = express();

const mongoose = require("mongoose");

const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB", {
	useNewUrlParser: true
});


const userSchema = new mongoose.Schema({  //it is an object created from mongoose class
	email: String,
	password: String

});
const secret = "YES"; //the seed for encryptions?


userSchema.plugin(encrypt, {secret:secret, encryptedFields:["password"]}); //will encrypt only one field using the secret code and the ENC fields.

const User = new mongoose.model("User", userSchema);




app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true
}));







app.get("/", function (req, res) {

	res.render("home");
});

app.get("/login", function (req, res) {

	res.render("login");
});

app.get("/register", function (req, res) { //get the register page
	res.render("register"); //load register site
});


app.post("/register", function (req, res) { //create new user when register is posted
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	}); //registers a new user


	newUser.save(function (err) {
		if (err) {
			console.log(err); //if ok, load the register site
		} else {
			res.render("secrets"); //else dont load it
		}

	});

});



app.post("/login", function (req, res) {
	const username = req.body.username;
	const password = req.body.password;
	User.findOne({
		email: username
	}, function (err, foundUser) { //passes error and found user
		if (err) {
			console.log(err);
		} else {
			if (foundUser) { //if it found a user
				if (foundUser.password === password) { //compare password to that user password
						res.render("secrets"); // and render secrets
					}
				}
			}
		}
	)});

app.post("/logout", function(req,res){
	res.redirect("/login");
});



app.listen(3000, function (req, res) {
	console.log("Server started on port 3k.");
});
