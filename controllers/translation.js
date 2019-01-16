const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Word = require("../models/wordSchema");
const Translation = require("../models/translationSchema");

exports.create = (req, res, next) => {
    translation = new Translation({
        source: req.body.source,
        target: req.body.target
    });
    translation.save()
        .then(result => {
            res.status(201).json({
                message: "trasnlation created",
                word: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};