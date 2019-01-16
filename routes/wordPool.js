let express = require('express');
const wordPoolConroller = require("../controllers/wordPool")
let router = express.Router();
let checkAuth = require("../middleware/check-auth");

router.post('/create',checkAuth, wordPoolConroller.create);

router.post('/search-category',checkAuth, wordPoolConroller.searchPhrase);

router.post('/add-word',checkAuth, wordPoolConroller.addWord);

router.get('/all', wordPoolConroller.getAll);

//router.get('/read',wordPoolConroller.read);

//router.post('/update',wordPoolConroller.update);

//router.delete('/delete', WordController.delete);

module.exports = router;
