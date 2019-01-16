let express = require('express');
const TeacherController = require("../controllers/teacher")
let router = express.Router();

router.post('/signup',TeacherController.user_signup);

router.get('/all',TeacherController.getAll);

router.post('/login', TeacherController.user_login);

router.post('/delete', TeacherController.user_delete);

module.exports = router;
