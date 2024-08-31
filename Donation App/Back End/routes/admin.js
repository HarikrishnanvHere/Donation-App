let express = require('express');

let adminController = require('../controllers/admin');


let router = express.Router();

router.get('/getInfo',adminController.getInfo);

router.get('/deleteInfo',adminController.deleteInfo);

router.get('/approveInfo', adminController.approveInfo);

router.get('/sendmail', adminController.sendmail);

module.exports = router;