let express = require('express');

let userController = require('../controllers/user');
let userAuthorizationController = require('../middleware/authorizationUser');

let router = express.Router();

router.post('/signup', userController.postSIgnUpUser);

router.post('/login', userController.postLogInUser);

router.get('/getUserHome',userAuthorizationController.getToken, userController.getUserHome);

router.get('/getdonations',userAuthorizationController.getToken, userController.getDonation);

router.get('/charityInfo', userController.getCharityInfo);

router.get('/download', userAuthorizationController.getToken, userController.downloadDonations );

router.get('/editdetails',userAuthorizationController.getToken, userController.editDetails);

router.post('/saveedits',userAuthorizationController.getToken, userController.saveEdits);


module.exports = router;