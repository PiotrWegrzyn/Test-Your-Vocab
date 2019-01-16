const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const async = require("async")
const Word = require("../models/wordSchema");
const Translation = require("../models/translationSchema");

exports.create = (req, res, next) => {
    word = new Word({
        _id: new mongoose.Types.ObjectId(),
        word: req.body.word,
        language: req.body.language,
        category: req.body.category,
        answer: req.body.answer,
        answer_lang: req.body.answer_lang
    });
    word.save()
        .then(result => {
            res.status(201).json({
                message: "Word created",
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

exports.getAll = (req, res, next) => {
    words = Word.find().exec()
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


/*
exports.create = (req, res, next) => {
    word = new Word({
        _id: new mongoose.Types.ObjectId(),
        word: req.body.word,
        language: req.body.language,
        category: req.body.category,
        difficulty: req.body.difficulty
    });
    word.save()
        .then(result => {
            res.status(201).json({
                message: "Word created",
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


exports.get_translations = async(req, res, next) => {
    let words=[];
    let translations_querry = Translation.find().or([{source: req.body.id}, {target: req.body.id}])
        .exec(function (err, translations) {
                for (let i = 0; i < translations.length; i++) {
                    console.log("Source" + translations[i].source);
                    Word.findById(translations[i].source).exec(function (err, word) {
                        words.push(word);
                    });
                    Word.findById(translations[i].target).exec(function (err, word) {
                        words.push(word);
                    });
                }
            }
        );
    res.status(201).json({translations: words});

};

    /*
            .catch(err => {
            Translation.find().or([{source: req.body.id}, {target: req.body.id}])
            .then(translations => translations.forEach(function(err, translation){
                console.log(("Word trans id: " + translation));
                console.log(("Translations: " + translations));
                Word.findById(translation.source).exec()
                    .then(word => {
                        words.push(word);
                        console.log("added"+word);
                    });
                console.log(err);
            }),
            res.status(201).json({translations: words})
            )
            console.log(err);
                res.status(500).json({
                    error: err
                });
            });
};
    */
