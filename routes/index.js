const express = require('express');
const validate = require('express-jsonschema').validate;
// const validateToken = require('../middleware/validate-token');
/**
 * Schemas
 */
const userSchema = require('../schemas/user');
/**
 * Controllers
 */
const userController = require('../controllers/user');

const router = express.Router();



/**
 * @swagger
 * /api/v1/login:
 *  post:
 *    description: Login to the application
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: credentails
 *        description: User credentails
 *        in: body
 *        required: true
 *        type: object
 *    responses:
 *      200:
 *        description: login
 */
// router.use('/logout', validateToken);

router.post('/login', validate({body: userSchema.login}), userController.login);
router.post('/logout', userController.logout);
router.post('/register', validate({body: userSchema.register}), userController.register);

module.exports = router;