const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/teacherSchema");

exports.user_signup = (req, res, next) => {
    Teacher.find({ email: req.body.email })
        .exec()
        .then(teacher => {

            if (teacher.length >= 1) {
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

                        const teacher = new Teacher({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            name: req.body.name,
                            lastname: req.body.lastname,
                            password: hash
                        });
                        teacher
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

exports.user_login = (req, res, next) => {
    Teacher.find({ email: req.body.email })
        .exec()
        .then(teacher => {
            //No such users found
            if (teacher.length < 1) {
                return res.status(401).json({
                    message: "Authetication error"
                });
            }
            //we found a user so we want to check password:
            else {
                bcrypt.compare(req.body.password, teacher[0].password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if (result) {const token = jwt.sign(
                        {
                            userId: teacher[0]._id,
                            name: teacher[0].name,
                            lastname: teacher[0].lastname,
                            email: teacher[0].email,
                            userType: "teacher"
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
    words = Teacher.find().exec()
        .then(words => {
            res.status(201).json({
                words: words
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