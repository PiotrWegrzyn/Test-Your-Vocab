let express = require('express');
const translationController = require("../controllers/translation")
let router = express.Router();

router.post('/create', translationController.create);

//router.get('/read',WordController.read);

//router.post('/update',WordController.update);

//router.delete('/delete', WordController.delete);

module.exports = router;
