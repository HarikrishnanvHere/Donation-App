let express = require('express');

let orgController = require('../controllers/org');
let middlewareController = require('../middleware/authorization');

let router = express.Router();

router.post('/signup', orgController.postSignUpOrg);

router.post('/login', orgController.postLogInOrg);

router.get('/getOrg', middlewareController.getToken, orgController.getOrgHome);

module.exports = router;