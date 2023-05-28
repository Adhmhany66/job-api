const express = require('express')
const {login , register , forgetPassword , resetPassword ,updatePassword}= require('../controllers/userCon')
const authentication =require('../middleware/authentication')
const router = express.Router()



router.route('/login').post(login)
router.route('/register').post(register)
router.post('/forgetPassword',forgetPassword)
router.post('/resettPassword/:token',resetPassword)
router.patch('/updatePassword',authentication,updatePassword)


module.exports = router
