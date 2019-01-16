let express = require('express');
let router = express.Router();
const StudentController = require("../controllers/student")
let checkAuth = require("../middleware/check-auth");

router.post('/signup',StudentController.user_signup);

router.get('/all',StudentController.getAll);

router.get('/tests',checkAuth,StudentController.getYourTests);

router.post('/login', StudentController.user_login);

router.post('/delete', StudentController.user_delete);


module.exports = router;
