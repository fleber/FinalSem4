//express
const express = require("express");
const app = express();
var reload = require("reload");
var router = express.Router();
var fs = require("fs");

app.use(express.static(__dirname + "/public"));

//express-redirect
var redirect = require("express-redirect");
redirect(app);

//body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//mongodb
const mongo = require("mongodb").MongoClient;
const path = "mongodb://localhost:27017/node1";

//bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 8;

//emailer
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.com',
    auth: {
        user: 'forTTTTestOnly@mail.com',
        pass: 'Test&1234'
    }
});

app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

//new user save to database with hashed password
app.post("/register-user", function(req, res){
    let newUser = req.body;

    bcrypt.hash(newUser.userPsw, saltRounds, function(err, hash){
        let userHashed = {
            userName: newUser.userName,
            userPsw: hash,
            userEmail: newUser.userEmail
        }
        console.log(userHashed);

        let mailOptions = {
            from: 'forTTTTestOnly@mail.com',
            to: userHashed.userEmail,
            subject: 'Thanks for using the blablabla chat!',
            text: 'Dear ' + userHashed.userName,
        };

        if(userHashed.userEmail == null){
            //do something
        }

        mongo.connect(path, function(err, db){
            if(err){
                console.log("db connect err", err)
            }
       
            let collection = db.collection("mandatoryII");            
            collection.insert(userHashed, function(err, success){
                if(err){
                    console.log("db create user error: ", err);
                }
                else{
                    transporter.sendMail(mailOptions, (err, info) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("welcome email is sent");
                        }
                    });
                    console.log(userHashed.userName + " is added to database");
                }
            });
            db.close();
        });
    
        let response = {"status": 200};
    
        res.json(response);
    });
});

//compare password to verify user
let profileName = "Anonymous";
app.post("/verify-user", function(req, res){
    let userInfo = req.body;
    mongo.connect(path, function(err, db){
        if(err){
            console.log("db connect err", err);
        }

        let collection = db.collection("mandatoryII");

        collection.findOne({"userName": userInfo.userName}, function(err, result){
            if(err){
                console.log("db find user error: ", err);
            }
            else if(result == null){
                console.log("can not find user");
            }else{
                bcrypt.compare(userInfo.userPsw, result.userPsw, function(error, result){
                    if(error){
                        console.log("db compare hash err", error)
                    } 
                    else{
                        if(result == true){
                            console.log("right password");
                            let response = {"status": 200};
                            profileName = userInfo.userName;
                            res.json(response);
                        }else{
                            console.log("wrong password");
                        }
                    }
                });

            }
        });
        db.close();
    });    
});

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", function(socket) {
    console.log("A client connected");

    socket.username = profileName;

    socket.on("chat message", function(data) {
        var message = data.message;
        var full_message = "<p class='message'>" + socket.username + ": " + message + "</p>"
        fs.appendFile(__dirname + "/chatHistory.txt", full_message, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("message saved");
            }
        });

        console.log("The client wrote: ", message);

        io.emit("new message", {"message": message, "username" : socket.username});          
    });

    socket.on("chat history", function() {
        var content = fs.readFileSync(__dirname + "/chatHistory.txt", "utf8");
        socket.emit("all chat history", {"content": content});
    });
});

server.listen(3000, function() {
    console.log("Server is listening on port 3000");
});
