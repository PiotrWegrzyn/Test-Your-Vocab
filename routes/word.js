let express = require('express');
const WordController = require("../controllers/word")
let router = express.Router();

router.post('/create', WordController.create);

router.get('/all',WordController.getAll);

//router.get('/translations',WordController.get_translations);

//router.get('/read',WordController.read);

//router.post('/update',WordController.update);

//router.delete('/delete', WordController.delete);

module.exports = router;
