const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const async = require("async")
const WordPool = require("../models/wordPoolSchema");
const Word = require("../models/wordSchema");
const Translation = require("../models/translationSchema");

exports.create = (req, res, next) => {
    if (req.userData.userType !== "teacher") {
        return res.status(401).json({
            message: 'Auth failed - only teachers allowed.'
        });
    }
    WordPool.find({ name: req.body.name })
        .exec()
        .then(pool => {

            if (pool.length >= 1) {
                return res.status(409).json({
                    message: "Name taken."
                });
            }
            else {
                let wordPool = new WordPool({
                    _id: new mongoose.Types.ObjectId(),
                    teacher: req.userData.userId,
                    name: req.body.name
                });
                wordPool.save()
                    .then(result => {
                        res.status(201).json({
                            message: "Word Pool created",
                            word: result
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
};

exports.searchPhrase = (req,res,next)=>{
    let wordPoolTarget = "none";
    let wordPoolMaxAmount =-1;
    let wordPoolName ="none";
    WordPool.find().exec()
        .then(wordpools => {
                console.log("dupa");
                wordpools.forEach(function (wordpoolForEach) {
                    wordpoolForEach.categories.forEach(function (category) {
                        if (category.name === req.body.categoryInput && category.quantity > wordPoolMaxAmount) {
                            wordPoolTarget = wordpoolForEach._id;
                            wordPoolMaxAmount = category.quantity;
                            wordPoolName = wordpoolForEach.name;
                            console.log(wordPoolName);
                        }
                    })
                });
                res.status(201).json({
                    poolID: wordPoolTarget,
                    name: wordPoolName,
                    amount: wordPoolMaxAmount
                });
            }
        )
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};

exports.addWord = (req, res, next) => {
    /*if (req.userData.userType !== "teacher") {
        return res.status(401).json({
            message: 'Auth failed - only teachers allowed.'
        });
    }
    */
    Word.findById(req.body.idword)
        .exec()
        .then(word=>{
            WordPool.findById(req.body.idwordpool)
                .exec()
                .then(wordpool => {
                    console.log("wordpool   "+wordpool);

                    let isAlreadyInside = false;
                    wordpool.categories.forEach(function(category) {
                        console.log("category "+category.name);
                        console.log("wordcategory "+word.category);

                        if(category.name === word.category){
                            //WordPool.updateOne(req.body.id, {$inc: {categories.$.name: req.body.wordID}})
                            isAlreadyInside = true;
                            wordpool.categories.push({name: word.category, quantity: 1});

                            category.quantity++;
                            WordPool.findByIdAndUpdate(req.body.idwordpool,{$set: {categories: wordpool.categories}}).exec().catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                        }
                    })
                    if(!isAlreadyInside){
                        wordpool.categories.push({name: word.category, quantity: 1});
                        console.log("creating new category    "+wordpool.categories);
                        WordPool.findByIdAndUpdate(req.body.idwordpool,{$set: {categories: wordpool.categories}}).exec().catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    }


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


    /*WordPool.findByIdAndUpdate(req.body.id, {$push: {words: req.body.wordID}})
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
        });*/
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

exports.getAll = (req, res, next) => {
    words = WordPool.find().populate("words", 'word').exec()
        .then(result => {
            res.status(201).json({
                wordPools: result
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
