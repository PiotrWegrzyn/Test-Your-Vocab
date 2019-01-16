let express = require('express');
const testConroller = require("../controllers/test")
let router = express.Router();
let checkAuth = require("../middleware/check-auth");


router.post('/create', checkAuth, testConroller.create);

router.get('/all', testConroller.getAll);

router.get('/get', checkAuth, testConroller.get);

router.get('/submit', checkAuth, testConroller.submit);

//router.post('/update',testConroller.update);

//router.delete('/delete', testConroller.delete);


module.exports = router;
