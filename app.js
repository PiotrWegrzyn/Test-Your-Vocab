var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var studentRouter = require('./routes/student');
var teacherRouter = require('./routes/teacher');
var testRouter = require('./routes/test');
var wordRouter = require('./routes/word');
var wordPoolRouter = require('./routes/wordPool');
var messengerBorRouter = require('./routes/messenger-bot');
var translationRouter = require('./routes/translation');
let mongoose = require('mongoose');
//var User = require('./models/UserSchema');

var app = express();
bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));


app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/word', wordRouter);
app.use('/word-pool', wordPoolRouter);
app.use('/translation', translationRouter);
app.use('/test', testRouter);
app.use('/messenger', messengerBorRouter);

app.set('view engine', 'html');


mongoose.connect("mongodb+srv://"+process.env.MONGO_ATLAS_UM+":" + process.env.MONGO_ATLAS_PW + "@cluster0-odrxs.mongodb.net/test?retryWrites=true",
    {
        useNewUrlParser: true
    }
);
mongoose.set('useCreateIndex', true);

module.exports = app;
