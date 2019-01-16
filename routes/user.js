var express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../models/studentSchema");
const Teacher = require("../models/teacherSchema");
var router = express.Router();



router.post('/teacher/signup', function(req, res, next) {
    console.log("teaccher connect");
    Teacher.find({ email: req.body.email })
        .exec()
        .then(teacher => {

            console.log("teaccher connect");
            if (teacher.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {

                console.log("teaccher connect");
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {

                        console.log("teaccher connect");
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
});


router.post('/teacher/login', function(req, res, next) {
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
                            email: teacher[0].email,
                            name: teacher[0].name,
                            lastname: teacher[0].lastname,
                            userId: teacher[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
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

});

router.post('/delete', function(req, res, next) {
    res.status(201).json({
        message:"User deleted."
    });
});






module.exports = router;
