// const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')


const auth =async(req , res, next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return new UnauthenticatedError('No token Provided')
    }
    const token = authHeader.split(' ')[1]
     try{
       const payLoad = jwt.verify(token , process.env.JWT_SECRET)
      //  const user = await User.findById(payLoad.id).select('-password')
      //  req.user = user


        req.user = {userId:payLoad.userId , name:payLoad.name}
       next()

     }catch(error){
      console.log(error)
       return new UnauthenticatedError('Authintcation Invalid')

     }
}

module.exports = auth