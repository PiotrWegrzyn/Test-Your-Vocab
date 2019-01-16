const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const async = require("async");
const WordPool = require("../models/wordPoolSchema");
const Test = require("../models/testSchema");
const Word = require("../models/wordSchema");
const Translation = require("../models/translationSchema");

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

exports.create = (req, res, next) => {
    if (req.userData.userType !== "teacher") {
        return res.status(401).json({
            message: 'Auth failed - only teachers allowed.'
        });
    }
    let rwords = [];
    WordPool.findById(req.body.word_pool).populate("words")
        .exec()
        .then( result=>{
            for(let i =0; i< req.body.number_of_words;i++) {
                rwords.push(result.words[getRandomInt(result.words.length)]);
            }
            test = new Test({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                teacher: req.body.teacher,
                student: req.body.student,
                word_pool: req.body.word_pool,
                number_of_words: req.body.number_of_words,
                assigned_words: rwords

            });
            test.save()
                .then(result => {
                    res.status(201).json({
                        message: "Test was created.",
                        word: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        });
};

exports.addWord = (req, res, next) => {
    WordPool.findByIdAndUpdate(req.body.id, {$push: {words: req.body.wordID}})
        .exec()
        .then(result => {
            res.status(201).json({
                message: "Updated",
                updated: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.update = (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    WordPool.findByIdAndUpdate(req.body.id, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(201).json({
                message: "Updated",
                updated: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.get = (req, res, next) => {
    let limit = "word";
    if (req.userData.userType === "teacher") {
        limit += " answer";
    }
    Test.findById(req.body.id)
        .populate("assigned_words", limit)
        .exec()
        .then(result => {

            res.status(201).json({
                message: "Updated",
                updated: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.submit = (req, res, next) => {
    Test.findById(req.body.id)
        .populate("assigned_words")
        .populate("student")
        .exec()
        .then(result => {
            if (req.userData.userId !== result.student.id) {
                return res.status(401).json({
                    message: 'Auth failed',
                    uid: req.userData.userId,
                    sud: result.student.id
                });
            }

            for (let i = 0; i < result.number_of_words; i++) {
                result.answers.push(req.body.answers[i]);
                if (result.assigned_words[i].answer === req.body.answers[i]) {
                    result.results.push(true);
                }
                else {
                    result.results.push(false);
                }
            }
            if (result.results !== []) {
                res.status(403).json({
                    message: "Forbidden - this test has already been submitted."
                });
            }
            Test.findOneAndUpdate({_id: req.body.id}, {
                $set: {
                    results: result.results,
                    answers: result.answers
                }
            }, {new: true})
                .exec()
                .then(result => {
                    res.status(201).json({
                        message: "Updated",
                        updated: result
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.getAll = (req, res, next) => {
    words = Test.find().exec()
        .then(words => {
            res.status(201).json({
                tests: words
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

