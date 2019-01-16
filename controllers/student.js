const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Test = require("../models/testSchema");

const Student = require("../models/studentSchema");

exports.user_signup = (req, res, next) => {
    Student.find({ email: req.body.email })
        .exec()
        .then(student => {

            if (student.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {

                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {

                        const student = new Student({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            name: req.body.name,
                            lastname: req.body.lastname,
                            password: hash
                        });
                        student
                            .save()
                            .then(result => {
                                //console.log(result);
                                res.status(201).json({
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
};


exports.getYourTests = (req, res, next) => {
    Test.find({student: req.userData.userId})
        .select("_id name assigned_words")
        .populate("assigned_words","word")
        .exec()
        .then(result =>{
            res.status(201).json({
                message: "Your tests:",
                tests: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};



exports.user_login = (req, res, next) => {
    Student.find({ email: req.body.email })
        .exec()
        .then(student => {
            //No such users found
            if (student.length < 1) {
                return res.status(401).json({
                    message: "Authentication error."
                });
            }
            //we found a user so we want to check password:
            else {
                bcrypt.compare(req.body.password, student[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (result) {const token = jwt.sign(
                        {
                            userId: student[0]._id,
                            name: student[0].name,
                            lastname: student[0].lastname,
                            email: student[0].email,
                            userType: "student"

                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "24h"
                        }
                    );
                        return res.status(200).json({
                            message: "Auth successful",
                            token: token
                        });
                    }
                    res.status(401).json({
                        message: "Auth failed"
                    });
                });
            }
        })
        .catch(err =>{
            return res.status(500).json({
                message: err
            });
        })
};

exports.getAll = (req, res, next) => {
    words = Student.find().exec()
        .then(words => {
            res.status(201).json({
                students: words
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};