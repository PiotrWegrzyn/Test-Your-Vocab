var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const login = require("facebook-chat-api");
const Student = require("../models/studentSchema");
const WordPool = require("../models/wordPoolSchema");

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


//creates an entry in appstate.json
router.get('/login', function(req, res, next) {

    var credentials = {email: "<insert your email here>", password: "<insert your password here>"};

    login(credentials, (err, api) => {
        if(err) return console.error(err);
        fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    });

    res.send('respond');

});

//start listening to your messages and propperly responds
router.get('/listen', function(req, res, next) {

    login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
        if(err) return console.error(err);

        api.setOptions({listenEvents: true});

        var stopListening = api.listen((err, event) => {
            if(err) return console.error(err);

            switch(event.type) {
                case "message":
                    if(event.body === '/stop') {
                        api.sendMessage("Goodbye…", event.threadID);
                        return stopListening();
                    }
                    if(event.body === '/echo') {
                        api.sendMessage("echo", event.threadID);
                    }

                    if(event.body === '/mcount') {
                        console.log(event.threadID);
                        api.getThreadInfo(event.threadID, (err, info) => {
                            if(err) return console.error(err);
                            api.sendMessage("Amount of messages:" + info["messageCount"]  , event.threadID);

                        });
                    }
                    if( event.body.substr(0,7).toUpperCase()=== '/search'.toUpperCase()) {
                        console.log("Searching for: " + event.body.substr(8,event.body.length));
                        api.getUserID(event.body.substr(8,event.body.length), (err, data) => {
                            console.log("geting user data");
                            if(err) return console.error(err);

                            // Send the message to the best match (best by Facebook's criteria)
                            var userID = data[0].userID;
                            console.log(userID +"\n"+ event.threadID);
                            //api.sendMessage("His id is:" + threadID, event.threadID);
                            api.getUserInfo(userID, (err, info) => {
                                if(err) return console.error(err);
                                api.sendMessage(JSON.stringify(info[userID]), event.threadID);
                            });
                        });
                    }
                    if(event.body.substr(0,6).toUpperCase()=== '/login'.toUpperCase()) {
                        let email = event.body.split(" ")[1];
                        let password = event.body.split(" ")[2];
                        console.log(event.threadID + event.body.substr(0, 6) + email + password);
                        Student.find({email: email})
                            .exec()
                            .then(student => {
                                if (student.length < 1) {
                                    api.sendMessage("Authentication error.[code:1]", event.threadID);
                                }
                                //we found a user so we want to check password:
                                else {
                                    bcrypt.compare(password, student[0].password, (err, result) => {
                                        if (err) {
                                           api.sendMessage("Authentication error.[code:2]", event.threadID);
                                        }
                                        if (result) {
                                            Student.findByIdAndUpdate(student[0]._id, {  $set: {facebookUID: event.threadID} })
                                                .exec()
                                                .then(result =>{
                                                    api.sendMessage("Authentication successful.", event.threadID);
                                                    api.sendMessage("Welcome: " + result.name + " " + result.lastname, event.threadID);

                                                })
                                                .catch(err => {
                                                    console.log(err);

                                                });
                                        }
                                    });
                                }
                            });
                    }
                    //sends a word from a given WordPool
                    //usage: /get <WordPool.name> eg. /get colors
                    if(event.body.substr(0,4).toUpperCase()=== '/get'.toUpperCase()) {
                        let pool_name = event.body.split(" ")[1];
                        console.log(event.threadID + event.body.substr(0,4)+ ":"+ pool_name);
                        //check if it is our user or some random guy
                        Student.find({facebookUID: event.threadID})
                            .exec()
                            .then(student => {
                                if (student.length >= 1) {

                                    WordPool.findOne({name:pool_name})
                                        .populate("words")
                                        .exec()
                                        .then(result =>{
                                            let rword =result.words[getRandomInt(result.words.length)];
                                            Student.findOneAndUpdate({facebookUID: event.threadID},{$set: {messenger_word_requesting_last_word_answer: rword.answer}}, {new: true})
                                                .exec()
                                                .then(student => {
                                                    api.sendMessage(rword.word, event.threadID);
                                                    //api.sendMessage(rword.answer, event.threadID);

                                                });
                                        })
                                        .catch(err=>{
                                            console.log(err);
                                        })
                                }
                                else {
                                    api.sendMessage("Please login.", event.threadID);
                                }
                            });
                    }
                    if(event.body.substr(0,1).toUpperCase()!== '/'.toUpperCase()) {
                        console.log(event.threadID + " answer: " +event.body);
                        //check if it is our user or some random guy
                        Student.find({facebookUID: event.threadID})
                            .exec()
                            .then(student => {
                                if (student.length >= 1) { //TODO make facebookUID unique
                                    if(student[0].messenger_word_requesting_last_word_answer===event.body){
                                        api.sendMessage("Good job.", event.threadID);
                                    }
                                    else {
                                        api.sendMessage("Wrong."+ student[0].messenger_word_requesting_last_word_answer, event.threadID);
                                    }
                                }
                                else {
                                    api.sendMessage("Please login.", event.threadID);
                                }
                            });
                    }
                    break;
                case "event":
                    console.log(event);
                    break;
            }
        });
    });
    res.render('index', { title: 'Express' });
});



router.get('/chybaTy', function(req, res, next) {


    login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
        if (err) return console.error(err);

        api.setOptions({listenEvents: true});

        var stopListening = api.listen((err, event) => {
            if (err) return console.error(err);

            switch (event.type) {
                case "message":
                    if (event.body === '/stop') {
                        api.sendMessage("Goodbye...", event.threadID);
                        return stopListening();
                    }
                    api.markAsRead(event.threadID, (err) => {
                        if (err) console.log(err);
                    });
                    api.sendMessage("Chyba ty.", event.threadID);
                    break;
                case "event":
                    console.log(event);
                    break;
            }
        });
    });
});


router.get('/echo', function(req, res, next) {


    login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
        if (err) return console.error(err);

        api.setOptions({listenEvents: true});

        var stopListening = api.listen((err, event) => {
            if (err) return console.error(err);

            switch (event.type) {
                case "message":
                    if (event.body === '/stop') {
                        api.sendMessage("Goodbye...", event.threadID);
                        return stopListening();
                    }
                    api.markAsRead(event.threadID, (err) => {
                        if (err) console.log(err);
                    });
                    api.sendMessage("Peter bot:" + event.body, event.threadID);
                    break;
                case "event":
                    console.log(event);
                    break;
            }
        });
    });
});



module.exports = router;
